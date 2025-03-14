function applyHRules()
{
  const hruleElements = document.querySelectorAll("*[data-hrule]");
  for(const element of hruleElements) {
    const ruleAttribute = element.getAttribute("data-hrule") || "1em";
    element.classList.add("hrule");
    element.style.setProperty("--hrule", ruleAttribute);
  }
}

function alterAsideHyperlinks()
{
  const OPEN_CLASS = "open";
  
  function buildCloseLink(panelElement) {
    const container = panelElement.querySelector(".container");
    
    const hr = document.createElement("hr");
    hr.setAttribute("data-hrule", "3em");
    const p = document.createElement("p");
    p.classList.add("center");
    const button = document.createElement("button");
    button.textContent = "Fermer";
    button.classList.add("btn");
    
    p.appendChild(button);
    container.appendChild(hr);
    container.appendChild(p);
    
    return button;
  }
  
  function closeAllPanels() {
    for(const { panelElement } of idPanelMapping.values()) {
      closePanel(panelElement);
    }
  }
  function closePanel(panelElement) {
    panelElement.classList.remove(OPEN_CLASS);
  }
  function openPanel(panelElement) {
    closeAllPanels();
    panelElement.classList.add(OPEN_CLASS);
  }
  
  // Create a mapping panelName=>[panelHyperlink, panelElement]
  const idPanelMapping = new Map(
    [
      ...document.querySelectorAll("*[data-asidectrl]")
    ].map(panelController => {
      const panelId = panelController.getAttribute("href").substring(1);
      const panelElement = document.getElementById(panelId);
      return [panelId, { panelElement, panelController }];
    })
  );
  
  // Alter all hyperlinks to have them opening a modal
  for(const { panelElement, panelController } of idPanelMapping.values()) {
    panelController.onclick = function(event) {
      event.preventDefault();
      openPanel(panelElement);
      return false;
    };
  }
  
  // Make all modal auto-closeable on clicking their controller or background
  for(const { panelElement, panelController } of idPanelMapping.values()) {
    const buttonController = buildCloseLink(panelElement);
    panelElement.onclick = function(event) {
      const eventTarget = event.target;
      if(eventTarget == this || eventTarget == buttonController) {
        closePanel(this);
      }
    }
  }
  
  // find a modal to open, or make sure all are closed
  {
    const hash = (window.location.hash || "").substring(1);
    const entry = idPanelMapping.get(hash);
    if(entry && !disallowModals) {
      const { panelElement, panelController } = entry;
      openPanel(panelElement);
    } else {
      closeAllPanels();
    }
  }
}


window.onload = () => {
  alterAsideHyperlinks();
  applyHRules();
}
