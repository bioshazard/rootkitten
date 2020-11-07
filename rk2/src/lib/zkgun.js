var zkgun = {
	gun: null, // must be initialized
	setGun: function(gun) {
		this.gun = gun
	},
	// eg, prettySlashDate(record.created["#"])
	prettySlashDate: function(slashDate) {
			var splitDate = slashDate.split('/')
			var d = new Date(
				splitDate[0], 	// Year
				splitDate[1] - 1, // Month (-1 to un-offset)
				splitDate[2], 	// Day
				splitDate[3], 	// Hour
				splitDate[4], 	// Minute
				splitDate[5], 	// Second
				0, 							// MS (ignored)
			)
			return d;
	},
	timeTree: function(timestamp = null) {
		var d
		// If no timestamp is provided, assume "now"
		if(timestamp === null) {
			d = new Date()
		} else {
			d = new Date(timestamp)
		}

		// use .back(X) to dial back date scope
		return this.gun
			.get(d.getFullYear())
			.get(d.getMonth() + 1) // Months begin as zero
			.get(d.getDate())
			.get(d.getHours())
			.get(d.getMinutes())
			.get(d.getSeconds())
	},
	urlUuidTitle: function(node) {
		return node.id + '/' + node.title.replace(/[^a-zA-Z0-9-_]/g, '-')
	}
}

export default zkgun
