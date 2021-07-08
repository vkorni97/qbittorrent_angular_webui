export function genHash(string: string): number {
	let hash = 0;
	for (let i = 0; i < string.length; ++i) {
		const c = string.charCodeAt(i);
		hash = (c + hash * 31) | 0;
	}
	return hash;
}
