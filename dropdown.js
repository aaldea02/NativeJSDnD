import { draggableList } from "./dragdrop.js";
document.addEventListener("DOMContentLoaded", () => {
  const placeIbeamAfterNode = (node) => {
    if (typeof window.getSelection != "undefined") {
      const range = document.createRange();
      range.setStartAfter(node);
      range.collapse(true);
      const selection = window.getSelection();
      selection.removeAllRanges();
      selection.addRange(range);
    }
  };

  const div1 = document.getElementById("div1");
  const autocomplete = document.createElement("span"); // make an array later on
  const autocomplete_result = document.createElement("span");

  const clearPopup = () => {
    autocomplete_result.innerHTML = "";
    autocomplete_result.style.display = "none";
  };

  const completeInput = (node) => {
    setTimeout(function () {
      div1.focus();
    }, 0);
    placeIbeamAfterNode(autocomplete);
    div1.setAttribute("contentEditable", true);
    autocomplete.setAttribute("contentEditable", false);

    clearPopup();
  };

  const popup = (node) => {
    const regExp = new RegExp("^" + autocomplete.innerText, "i");

    const fragment = document.createDocumentFragment();

    let flag = false;

    for (let x = 0; x < draggableList.length; x++) {
      if (regExp.test(draggableList[x].content)) {
        flag = true;

        const choices = document.createElement("p");
        choices.innerText = draggableList[x].content;
        choices.setAttribute("class", "choices");
        choices.setAttribute(
          "onclick",
          "autocomplete.innerText=this.innerText;autocomplete_result.innerHTML='';autocomplete_result.style.display='none'; completeInput()"
        );

        fragment.appendChild(choices);
      }
    }

    if (!flag) {
      clearPopup();
    }
    autocomplete_result.innerHTML = "";
    autocomplete_result.style.display = "block";
    autocomplete_result.appendChild(fragment);
  };

  const selectChoice = (node) => {
    const child = autocomplete_result.children[0];
    child.style.backgroundColor = "pink";
    //alert("wow");
  };

  const insertNode = (node) => {
    let sel, range;

    if (window.getSelection) {
      sel = window.getSelection();

      if (sel.getRangeAt && sel.rangeCount) {
        range = sel.getRangeAt(0);
        range.deleteContents();

        const fragment = document.createDocumentFragment();
        const sign = document.createTextNode("@");
        const wordsAfter = document.createElement("span");

        fragment.appendChild(sign);
        if (node.classList.contains("AutoComplete")) fragment.appendChild(node);
        fragment.appendChild(wordsAfter);

        range.insertNode(fragment);

        range.collapse(true);
        setTimeout(() => {
          node.focus();
        }, 0);
      }
    }
  };

  const createInput = (node) => {
    autocomplete.setAttribute("id", "autocomplete");
    autocomplete.setAttribute("class", "AutoComplete");
    autocomplete_result.setAttribute("id", "autocomplete_result");

    insertNode(autocomplete);

    div1.appendChild(autocomplete_result);

    div1.setAttribute("contentEditable", false);
    autocomplete.setAttribute("contentEditable", true);
    autocomplete_result.setAttribute("contentEditable", false);
    autocomplete.setAttribute("draggable", true);

    setTimeout(() => {
      autocomplete.focus();
    }, 0);

    autocomplete.addEventListener("keyup", popup); // passing in the node argument breaks it
    autocomplete.addEventListener("change", popup);
  };

  const deleteInput = (node) => {
    setTimeout(() => {
      autocomplete.blur();
    }, 0);

    div1.removeChild(autocomplete);
    div1.removeChild(autocomplete_result);
    div1.setAttribute("contentEditable", true);

    setTimeout(() => {
      div1.focus();
    }, 0);

    document.execCommand("selectAll", false, null);

    document.getSelection().collapseToEnd();
  };

  const checkKeyPressed = (evt) => {
    if (evt.key === "@") {
      createInput();
    } else if (
      evt.key === "Backspace" &&
      div1.contains(document.getElementById("autocomplete")) &&
      autocomplete.innerText === ""
    ) {
      deleteInput();
    } else if (
      evt.key === "Enter" && // need to add tab
      div1.contains(document.getElementById("autocomplete"))
    ) {
      completeInput();
    } else if (
      evt.key === "ArrowDown" && 
      div1.contains(document.getElementById("autocomplete"))
    ) {
      selectChoice();
    }
  };

  div1.addEventListener("keydown", checkKeyPressed, false);
});
