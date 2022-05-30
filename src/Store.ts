import { reactive, App, ComputedRef, computed, markRaw } from "vue";
import { modalisStoreKey } from "./symbols";
import ModalRenderingErrorComponent from "./components/ModalRenderingError.vue";
import ModalView from "./components/ModalView.vue";
import { generateUUID } from "./util/UUID";
import mitt from "mitt";
import type { Emitter } from "mitt";

function assert(condition: any, msg: string) {
  if (!condition) throw new Error(`[Modalis] ${msg}`);
}

export type StoreConfig = {
  strictMode?: boolean;
};

export interface IModalStore {
  instances: any;
  activeModal: ComputedRef<ModalInstance | undefined>;

  registerMask(maskObject: Mask): void;
  registerPlace(placeName: string): void;
  registerModal(modalDefinition: Modal): void;
  getModalData<T = any>(ID: string): T;
  modalExists(ID: string): boolean;
  showModal(name: string, data: any, options: ShowOptions): Promise<any>;
  showError(name: string, data: any, options: ShowOptions): Promise<any>;
  showConfirmation(name: string, data: any, options: ShowOptions): Promise<any>;
  closeModal(ID: string): void;
  returnModal(ID: string, value: any): void;
  throwModal(ID: string, value: any): void;
  install(app: App): void;
}

export enum ModalType {
  Modal = "modal",
  Error = "error",
  Confirmation = "confirmation",
}

export type Mask = {
  name: string;
  component: any;
};
export type Modal = {
  name: string;
  component: any;
  singleton?: boolean;
  type: ModalType;
  place?: string;
  mask?: string;
  key?: string;
};

interface ModalInstance {
  name: string;
  data: any;
  type: ModalType;
  place: string | undefined;
  mask: string | undefined;
  parent: string | undefined;
  active: boolean;
  component: any;
}

export type ShowOptions = {
  place?: string;
  mask?: string;
  parent?: string;
};

export interface ModalComposite<T = any> {
  data: T;
  showModal(name: string, data: any, options: any): Promise<any>;
  showError(name: string, data: any, options: any): Promise<any>;
  showConfirmation(name: string, data: any, options: any): Promise<any>;
  close(): void;
  return(returnValue: any): void;
  throw(returnValue: any): void;
}

export function createModalis(config: StoreConfig = {}): IModalStore {
  return new Store(config);
}

export class Store implements IModalStore {
  private strictMode: boolean;
  private _modals: Map<string, Modal>;
  private _masks: Map<string, Mask>;
  private _places: Array<string>;
  private _data: any;
  private _activeModal: ComputedRef<ModalInstance | undefined>;
  private _bus: Emitter<any>;

  constructor(config: StoreConfig = {}) {
    this._modals = new Map<string, Modal>();

    this._masks = new Map<string, Mask>();

    this._places = new Array<string>();

    this.strictMode = config.strictMode ?? true;

    this._bus = mitt();

    this._data = reactive({
      instances: {},
    });

    this._activeModal = computed(() => {
      let modal = undefined;
      let keys = Object.keys(this._data.instances);
      keys.forEach((key) => {
        if (this._data.instances[key].active) {
          modal = this._data.instances[key];
          modal.key = key;
        }
      });
      return modal;
    });

    this.registerModal({
      name: "modalRenderingError",
      type: ModalType.Error,
      component: ModalRenderingErrorComponent,
    });
  }

  get instances() {
    return this._data.instances;
  }

  get activeModal(): ComputedRef<ModalInstance | undefined> {
    return this._activeModal;
  }

  registerMask(maskObject: Mask): void {
    assert(
      maskObject.name,
      "You have to provide a name during Mask registration"
    );
    assert(
      maskObject.component,
      "You have to provide a VueComponent during Mask registration"
    );
    assert(
      !this._masks.get(maskObject.name),
      `Mask object with name ${maskObject.name} is already exists!`
    );
    this._masks.set(maskObject.name, maskObject.component);
  }

  registerPlace(placeName: string): void {
    assert(placeName, "Place without a name is not registerable");
    assert(
      !this._places.includes(placeName),
      `Place with name ${placeName} is already exists!`
    );
    this._places.push(placeName);
  }

  registerModal(modalDefinition: Modal): void {
    assert(modalDefinition.name, "Missing name");
    assert(modalDefinition.type, "Missing type");
    assert(modalDefinition.component, "Missing component");
    if (modalDefinition.name !== "modalRenderingError" && this.strictMode) {
      assert(
        !this._modals.get(modalDefinition.name),
        `Modal with name ${modalDefinition.name} is already exists!`
      );
    }
    modalDefinition.singleton = modalDefinition.singleton ?? false;
    modalDefinition.place = modalDefinition.place ?? "default";
    this._modals.set(modalDefinition.name, modalDefinition);
  }

  _show(name: string, type: ModalType, data: any, options: ShowOptions) {
    assert(this._modals.get(name), "Modal is not registered with name ${name}");
    if (options.place) {
      assert(
        this._places.includes(options.place),
        `Place is not registered with name ${options.place}`
      );
    }
    assert(
      !options.place && this._places.includes("default"),
      "Default place is not registered. Place a modal-view somewhere in your project"
    );
    assert(
      this._modals.get(name) && this._modals.get(name)!.type === type,
      `The type of the modal ${name} is not ${type}`
    );
    if (
      this._modals.get(name)!.singleton &&
      Object.values(this._data.instances).find(
        (instance: any) => instance.name === name
      )
    ) {
      throw new Error(
        `[Modalis] The modal ${name} is a singleton. You can't open more!`
      );
    }

    const modalOptions: Modal = this._modals.get(name)!;
    return new Promise((resolve, reject) => {
      const uuid = generateUUID();

      let modalObject: ModalInstance = {
        name: name,
        data: data,
        type: type,
        place: options.place || modalOptions.place,
        mask: options.mask || modalOptions.mask || undefined,
        parent: options.parent || undefined,
        active: true,
        component: markRaw(modalOptions.component),
      };

      this._data.instances[uuid] = Object.assign({}, modalObject);

      this._hideOther(uuid);

      const returnHandler = (val: any) => {
        this._bus.off(`return:${uuid}`);
        if (val.type === "error") {
          return reject(val.value);
        }
        return resolve(val.value);
      };

      this._bus.on(`return:${uuid}`, returnHandler);
    });
  }

  modalExists(ID: string): boolean {
    return !!this._data.instances[ID];
  }

  getModalData<T = any>(ID: string): T {
    return this._data.instances[ID].data;
  }

  _hideOther(ID: string) {
    Object.keys(this._data.instances).forEach((instanceID) => {
      if (instanceID === ID) {
        return;
      }
      this._data.instances[instanceID].active = false;
    });
  }

  _activate(ID: string) {
    this._data.instances[ID].active = true;
  }

  async showModal(
    name: string,
    data: any = {},
    options: ShowOptions = {}
  ): Promise<any> {
    return this._show(name, ModalType.Modal, data, options);
  }

  async showError(
    name: string,
    data: any = {},
    options: ShowOptions = {}
  ): Promise<any> {
    return this._show(name, ModalType.Error, data, options);
  }

  async showConfirmation(
    name: string,
    data: any = {},
    options: ShowOptions = {}
  ): Promise<any> {
    return this._show(name, ModalType.Confirmation, data, options);
  }

  closeModal(ID: string): void {
    this._bus.emit(`return:${ID}`, {
      type: "close",
      value: undefined,
    });
    let parentID = this._data.instances[ID]
      ? this._data.instances[ID].parent
      : false;
    delete this._data.instances[ID];
    if (parentID) {
      this._activate(parentID);
    }
  }

  returnModal(ID: string, value: any): void {
    this._bus.emit(`return:${ID}`, {
      type: "return",
      value,
    });
    this.closeModal(ID);
  }
  throwModal(ID: string, value: any): void {
    this._bus.emit(`return:${ID}`, {
      type: "error",
      value,
    });
    this.closeModal(ID);
  }

  install(app: App) {
    app.provide(modalisStoreKey, this);
    app.config.globalProperties.$modalis = this;
    app.component("ModalView", ModalView);
  }
}
