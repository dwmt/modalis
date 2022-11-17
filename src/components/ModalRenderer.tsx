import { defineComponent, Fragment, Teleport, PropType } from 'vue'

import { type ModalisContext } from '../context'
import { ErrorBoundary } from './ErrorBoundary'
export const ModalRenderer = defineComponent({
	props: {
		context: {
			type: Object as PropType<ModalisContext>,
			required: true,
		},
	},
	setup(props) {
		return () => (
			<Fragment>
				{props.context.modals.value.map((modal) => {
					const Component = modal.component
					return (
						<Teleport key={modal.key} to="body">
							<ErrorBoundary>
								<Component
									{...modal.data}
									onReturn={modal.return}
									onThrow={modal.throw}
								/>
							</ErrorBoundary>
						</Teleport>
					)
				})}
			</Fragment>
		)
	},
})
