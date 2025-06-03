import {confirm} from '../default-button.js'

export default  (content, options = {}) => {
    const popup = LightPopup({
        content,
        buttons:[confirm(options)],
        ...options
    }, 'alert')

    return popup
}