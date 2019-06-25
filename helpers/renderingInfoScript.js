function getMobileMinWidthScript(context) {
  const isotypeObject = `window.${context.id}`;
  return `
    if (${isotypeObject} === undefined) {
      ${isotypeObject} = {};
    }
    ${isotypeObject}.element = document.querySelector("#${context.id}");

    ${isotypeObject}.handleMinWidth = function() {
      var iconContainers = document.querySelectorAll('.q-isotype-icon-container');
      if (${isotypeObject}.width > 400) {
        ${isotypeObject}.removeMobileMinWidthClass(iconContainers);
      } else {
        ${isotypeObject}.addMobileMinWidthClass(iconContainers);
      } 
    };

    ${isotypeObject}.removeMobileMinWidth = function(iconContainers) {
      iconContainers.forEach(function(iconContainer){
        if (iconContainer.classList.includes("-mobile")) {
          iconContainer.classList.add("q-isotype-icon-container" + "--" + iconContainer.dataset.containerType);
          iconContainer.classList.remove("q-isotype-icon-container" + "--" + iconContainer.dataset.containerType + "-mobile");
        }
      });
    };

    ${isotypeObject}.addMobileMinWidthClass = function(iconContainers) {
      iconContainers.forEach(function(iconContainer){
        iconContainer.classList.remove("q-isotype-icon-container" + "--" + iconContainer.dataset.containerType);
        iconContainer.classList.add("q-isotype-icon-container" + "--" + iconContainer.dataset.containerType + "-mobile");
      });
    };
    
    if (!window.q_domready) {
      window.q_domready = new Promise(function(resolve) {
        if (document.readyState && (document.readyState === 'interactive' || document.readyState === 'complete')) {
          resolve();
        } else {
          function onReady() {
            resolve();
            document.removeEventListener('DOMContentLoaded', onReady, true);
          }
          document.addEventListener('DOMContentLoaded', onReady, true);
          document.onreadystatechange = function() {
            if (document.readyState === "interactive") {
              resolve();
            }
          }
        }
      });
    }
    
    window.q_domready.then(function() {
      ${isotypeObject}.width = ${isotypeObject}.element.getBoundingClientRect().width;
      ${isotypeObject}.handleMinWidth();
    });

    window.addEventListener('resize', ${context.id}debounce(function() {
      requestAnimationFrame(function() {
        var newWidth = ${isotypeObject}.element.getBoundingClientRect().width;
        if (newWidth !== ${isotypeObject}.width) {
          ${isotypeObject}.width = newWidth;
          ${isotypeObject}.handleMinWidth();
        }
      });
    }, 250));
  `;
}

module.exports = {
  getMobileMinWidthScript: getMobileMinWidthScript
};
