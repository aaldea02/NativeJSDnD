const create_UUID = () => {
  let dt = new Date().getTime();
  let uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      let r = (dt + Math.random() * 16) % 16 | 0;
      dt = Math.floor(dt / 16);
      return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
  });
  return uuid;
}

export const draggableList= [
  {
    id: create_UUID(),
    content: "Apt Date"
  },
  {
    id: create_UUID(),
    content: "Apt Time"
  },
  {
    id: create_UUID(),
    content: "Location"
  },
  {
    id: create_UUID(),
    content: "Patient Name"
  },
]; 
document.addEventListener('DOMContentLoaded', () => {
  
  // ]gets the input div
  const div1 = document.getElementById('div1');
  div1.setAttribute("contentEditable", true);

  // creates draggables
  for (var x = 0, b = document.createDocumentFragment(), c = false; x < draggableList.length; x++) 
  {
   
    var d = document.createElement("span");
    d.setAttribute("class","draggables");
    d.setAttribute("id", draggableList[x].id);

    d.innerText = draggableList[x].content;
    d.setAttribute("contentEditable", false); 
    d.setAttribute("draggable", true);
    b.appendChild(d);
    
  }
  div1.after(b);

  // variables
let typingTimer;               
let doneTypingInterval = 1000;  

  
const clearSpan = (className) => {
   
  div1.innerHTML = div1.innerHTML.replace(/<\/?span[^>]*>/g,"");

}
const doneTyping =  () => {
  
  div1.innerHTML = div1.innerText.replace(/(^|<\/?[^>]+>|\s+)([^\s<]+)/g, '$1<span></span><span class="words">$2</span><span></span>');
  // replace only  the draggables next to get back attributes?
}

  
  // event listeners for drag drop
  document.addEventListener("dragover", function(ev) {
    ev.preventDefault();
  });
  
  document.addEventListener("dragstart", function(ev) {
    ev.dataTransfer.setData("text", ev.target.id);
  });
  
  // specifies event listener to div1
  div1.addEventListener("drop", function(ev) {
      ev.preventDefault();
      const data = ev.dataTransfer.getData("text");
      if(document.getElementById("div1").contains(document.getElementById(data))) {
        ev.target.appendChild(document.getElementById(data));
    } else {
      const nodeCopy = document.getElementById(data).cloneNode(true);
      // technically we need to create a new id but code breaks if I do
      // nodeCopy.id = uuid();
      ev.target.appendChild(nodeCopy);
    }
  });

  div1.addEventListener('input', () => {
    // setTimeout(clearSpan("words"),2000);
  });

  // on keyup, start the countdown
  div1.addEventListener('keyup', () => {
      clearTimeout(typingTimer);
        //typingTimer = setTimeout(doneTyping, doneTypingInterval);     
      
  });

  // replaces all the span tags, need to not replace the draggables

  
  // adds span might update to something better
  div1.innerHTML = div1.innerText.replace(/(^|<\/?[^>]+>|\s+)([^\s<]+)/g, '$1<span></span><span class="words">$2</span><span></span>');
 

});
