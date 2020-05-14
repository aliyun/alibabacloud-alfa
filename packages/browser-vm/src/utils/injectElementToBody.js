
const injectElementToBody = (el, method) => {
  const elAppId = el.appId;
  let parentContainer = window.document.body.querySelector(elAppId);

  if (!parentContainer) {
    parentContainer = document.createElement(elAppId);
    window.document.body.appendChild(parentContainer);
  }
  return parentContainer[method](el);
}

export default injectElementToBody;