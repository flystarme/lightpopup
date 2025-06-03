import { confirm, cancel } from '../default-button.js'
import lang from '../lang.js'

export default (options = {}) => {
    const {content, inputType = 'text', inputPlaceholder = lang.promptPlaceholder, inputValue = '', inputRequired = true, autofocus = true} = options

    const div = document.createElement('div')
    div.className = 'light-popup-prompt-in'

    if (content){
        const contentDiv = document.createElement('div')
        contentDiv.className = 'light-popup-prompt-content'
        contentDiv.innerHTML = content
        div.appendChild(contentDiv)
        delete options.content
    }

    const input = document.createElement('input')
    input.type = inputType
    input.className = 'light-popup-input'
    input.placeholder = inputPlaceholder
    input.value = inputValue

    div.appendChild(input)

    const popup = LightPopup({
        content: div,
        buttons:[cancel(options), confirm(options, () => {
            if (inputRequired && input.value === ''){
                input.focus()
                return false
            }

            return [input.value]
        })],
        ...options
    }, 'prompt')

    if (autofocus){
        input.focus()
    }

    return popup
}