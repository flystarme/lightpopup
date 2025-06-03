import { confirm, cancel } from '../default-button.js'

export default (content, options = {}) => {
    const popup = LightPopup({
        content,
        buttons:[cancel(options), confirm(options)],
        ...options
    }, 'confirm')

    return popup
}