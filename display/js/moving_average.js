class MovingAverageCalculator {
    constructor() {
        this.count = 0
        this._mean = 0
    }

    update(newValue) {
        this.count++

        const differential = (newValue - this._mean) / this.count

        const newMean = this._mean + differential

        this._mean = newMean
    }

    get mean() {
        return this._mean
    }
}