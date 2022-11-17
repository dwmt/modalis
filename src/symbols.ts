export const hasSymbol =
	typeof Symbol === 'function' && typeof Symbol.toStringTag === 'symbol'

export const PolySymbol = (name: string) =>
	hasSymbol ? Symbol(name) : '_m_' + name
