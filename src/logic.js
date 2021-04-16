import axios from "axios"
import {makeAutoObservable} from "mobx"

class MainStore {
    constructor() {
        makeAutoObservable(this)
    }

    state = {
        age: 0,
        gender: 'other',
        address: '',
        location: '',
        country: '',
        lung_problems: false,
        heart_problems: false,
        active_step: 0,
        risk: undefined
    }

    set_state = (obj) => {
        this.state = {...this.state, ...obj}
    }

    detect_country = async (address) => {
        const response = await axios.get(`http://api.positionstack.com/v1/forward?access_key=21406d63ba55912883fb09b030915026&limit=1&query=${address}`)
        const country = response?.data?.data?.[0]?.country
        return country
    }

    calculate_risk = () => {
        let risk = 0
        if (40 <= this.state.age && this.state.age < 60) risk += 3
        if (60 <= this.state.age && this.state.age < 70) risk += 5
        if (this.state.age >= 70) risk += 10
        if (this.state.gender === 'male') risk += 1
        if (this.state.lung_problems) risk += 4
        if (this.state.heart_problems) risk += 4
        if (this.state.country === 'United States') risk = risk * 0

        this.set_state({risk: Math.min(risk, 10)})
    }
}

export const main_store = window.main_store = new MainStore()