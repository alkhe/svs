function parse_version(v) {
	const dash_index = v.indexOf('-')
	const [ver, tags] = dash_index === -1
		? [v, []]
		: [v.slice(0, dash_index), v.slice(dash_index + 1).split('.')]

	const [major, minor, patch] = ver.split('.')

	return { major, minor, patch, tags }
}

// Comparator :: { comparison, major, minor, patch, tags }
function parse_comparator(range) {
	const num_index = range.match(/\d/).index
	const comparison = range.slice(0, num_index)

	const { major, minor, patch, tags } = parse_version(range.slice(num_index))

	return { comparison, major, minor, patch, tags }
}

// Range :: [Comparator]
function parse_range(range) {
	return range.split(' ').map(parse_comparator)
}

// Set :: [Range]
function parse_set(set) {
	return set.split('||').map(parse_range)
}

const compare = (pM, pm, pp, pt, qM, qm, qp, qt) => compare_nums(pM, qM) || compare_nums(pm, qm) || compare_nums(pp, qp) || compare_tags(pt, qt)

const compare_nums = (p, q) => p - q

const numeric = /^[0-9]+$/
const compare_ids = (p, q) =>
	numeric.test(p) && numeric.test(q)
		? compare_nums(p, q)
		: p.localeCompare(q)

const compare_tags = (pt, qt) => {
	const pl = pt.length
	const ql = qt.length

	if (pl === 0) {
		if (ql === 0) {
			return 0
		} else {
			return 1
		}
	} else {
		if (ql === 0) {
			return -1
		} else {
			return actually_compare_tags(pt, qt)
		}
	}
}

const actually_compare_tags = (pt, qt) => {
	for (let i = 0 ;; i++) {
		const pc = pt[i]
		const qc = qt[i]

		const pcu = pc === undefined
		const qcu = qc === undefined
		
		if (pcu) {
			if (qcu) {
				return 0
			} else {
				return -1
			}
		} else {
			if (qcu) {
				return 1
			} else {
				if (pc === qc) {
					continue
				} else {
					return compare_ids(pc, qc)
				}
			}
		}
	}
}

const lt = x => x < 0
const lte = x => x <= 0
const gt = x => x > 0
const gte = x => x >= 0
const eq = x => x === 0

const cmp_map = {
	'<': lt,
	'<=': lte,
	'>': gt,
	'>=': gte,
	'': eq
}

const satisfies_comparator = (p, q) =>
	p.tags.length !== 0 && q.tags.length === 0
		? false
		: cmp_map[q.comparison](compare(p.major, p.minor, p.patch, p.tags, q.major, q.minor, q.patch, q.tags))

const satisfies_range = (p, range) => {
	for (let i = 0; i < range.length; i++) if (!satisfies_comparator(p, range[i])) return false
	return true
}

const satisfies_set = (p, set) => {
	for (let i = 0; i < set.length; i++) if (satisfies_range(p, set[i])) return true
	return false
}

const satisfies = (version, set) => satisfies_set(parse_version(version), parse_set(set))

module.exports = {
	satisfies,
	satisfies_set,
	satisfies_range,
	satisfies_comparator,
	parse_set,
	parse_range,
	parse_comparator
}
