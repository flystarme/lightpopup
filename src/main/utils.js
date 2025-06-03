const setElementHTML = (el, content, useHTML) => {
    if (content instanceof HTMLElement){
        el.appendChild(content)
    }else if(useHTML){
        el.innerHTML = content
    }else{
        el.innerText = content
    }
}

export {
    setElementHTML,
}