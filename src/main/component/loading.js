import LightPopup from '../core.js'
import lang from '../lang.js'

export default (content, options) => {
    content = content || lang.loading
    const popup = LightPopup({
        title: false,
        icon: 'loading',
        content,
        ...options
    }, 'loading')

    return popup
}