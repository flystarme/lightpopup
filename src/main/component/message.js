export default (content, options) => {
    const popup = LightPopup({
        title: false,
        content,
        autoClose: 3000,
        ...options
    }, 'message')

    return popup
}