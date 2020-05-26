const Mane = () => {
  //--------------------------------------------------
  // Target element to render the app
  //--------------------------------------------------
  this.target = () => document.querySelector("#app");

  //--------------------------------------------------
  // Required data for build.
  // DO NOT TOUCH
  //--------------------------------------------------
  this.html = null;
  this.count = 0;
  this.reactiveElements = [];

  //--------------------------------------------------
  // Get Method
  //--------------------------------------------------
  this.get = key => {
    return this.state[key];
  }

  //--------------------------------------------------
  // Set Method
  //--------------------------------------------------
  // When updating values in this.state, use this
  // method so that the app updates properly.
  //--------------------------------------------------
  // Example:
  //--------------------------------------------------
  // this.set("name", "New Name");
  // Will update this.state.name = "New Name"
  // and will update the change in the app
  //--------------------------------------------------
  this.set = (key, val) => {
    this.state[key] = val;
    this.privateMethods.update(key);
  }

  
  //--------------------------------------------------
  // Attribute Selectors
  //--------------------------------------------------
  // Define attribute selectors here. Use prefix "m-".
  //--------------------------------------------------
  this.selectors = {
    id:     "m-id",
    class:  "m-class",
    click:  "m-click",
    event:  "m-event"
  }

  //--------------------------------------------------
  // Data to be used in the app
  //--------------------------------------------------
  // Define your data here. It can be rendered in the
  // app by referencing with {{<key>}}
  // Example: {{name}} will output the value of
  // this.state.name
  //--------------------------------------------------
  this.state = {
    name: "My Template",
    counter: 0,
    buttonName: "Alert"
  }

  //--------------------------------------------------
  // HTML Template
  //--------------------------------------------------
  // Build your html here.
  //--------------------------------------------------
  // Attributes
  //--------------------------------------------------
  // Use m-class to set classes (multiple supported)
  // Use m-event to define an event and handler
  // separated by a comma.
  //--------------------------------------------------
  // Example:
  //--------------------------------------------------
  // m-event="<event name>,<method>"
  // m-event="click,myMethod"
  //--------------------------------------------------
  this.template = () => {
    let element = document.createElement("div");
        element.id = "container";
        element.innerHTML = `
          <h1>{{name}}</h1>
          <p m-class="box red">Class: box red</p>
          <p m-class="box blue">Class: box blue</p>
          <button
            m-class="my-button"
            m-event="click,changeTitle"
          >Change Title</button>
          <button
            m-class="my-button"
            m-event="click,alert"
          >{{buttonName}}</button>
          <div m-class="counter-box">
            <p>{{counter}}</p>
            <p><b>Adjust Counter</b></p>
            <button
              m-class="my-button counter-button"
              m-event="click,counterUp"
            >+</button>
            <button
              m-class="my-button counter-button"
              m-event="click,counterDown"
            >-</button>
          </div>
        `;
      return element;
  }

  //--------------------------------------------------
  // CSS
  //--------------------------------------------------
  // Define classes and hover states here.
  // Single class selectors supported only.
  // Nesting classes/elements not yet supported.
  //--------------------------------------------------
  // Example:
  //--------------------------------------------------
  // "<class name>": "<style>:<value>;"
  // For hover states use:
  // "<class name>:hover": "<style>:<value>;"
  //--------------------------------------------------
  this.css = {
    "box": `
      border-width: 1px;
      border-style: solid;
      background-color: #eeeeee;
    `,
    "counter-box": `
      border: 2px solid black;
    `,
    "red": `
      border-color: red;
    `,
    "blue": `
      border-color: blue;
    `,
    "my-button": `
      cursor: pointer;
      padding: 5px 10px;
      margin: 5px;
      font-weight: 600;
      color: #333;
      background-color: #eee;
      transition: color 0.3s, background-color: 0.3s;
    `,
    "my-button:hover": `
      color: #eee;
      background-color: #333;
    `,
    "counter-button": `
      width: 80px;
    `
  }

  //--------------------------------------------------
  // Methods
  //--------------------------------------------------
  // Define methods to be used in the app here.
  // Parameters not yet supported.
  //--------------------------------------------------
  this.methods = ({
    changeTitle: () => {
      this.set("name", "My Template is awesome!");
    },
    counterUp: () => {
      this.set("counter", this.state.counter + 1);
    },
    counterDown: () => {
      this.set("counter", this.state.counter - 1);
    },
    alert: () => {
      alert("Button Clicked");
    }
  });

  //--------------------------------------------------
  // Private Methods
  //--------------------------------------------------
  // Required for the app to run.
  // DO NOT TOUCH
  //--------------------------------------------------
  this.privateMethods = ({
    buildHTML: () => {
      this.html = this.template();
    },
    convertCSS: css => {
      let convert = {};
      this.css[css].trim().replace(/\n/g,"").split(";").forEach(style => {
        let item = style.trim().split(":");
        if (item.length > 1) convert[item[0].trim()] = item[1].trim()
      });
      return convert;
    },
    assignCSS: (element, css) => {
      for (let style in css) {
        element.style[style] = css[style];
      }
    },
    initCSS: () => {
      document.querySelectorAll(`[${this.selectors.class}]`).forEach(element => {
        element.getAttribute(this.selectors.class).split(" ").forEach(item => {
          this.privateMethods.assignCSS(
            element,
            this.privateMethods.convertCSS(item)
          );
          if (this.css[`${item}:hover`] != undefined) {
            this.privateMethods.addHoverCSS(
              element,
              item
            );
          }
        });
      });
    },
    addHoverCSS: (element, cssClass) => {
      element.addEventListener("mouseover", () => {
        this.privateMethods.assignCSS(
          element,
          this.privateMethods.convertCSS(`${cssClass}:hover`)
        );
      });
      element.addEventListener("mouseleave", () => {
        this.privateMethods.assignCSS(
          element,
          this.privateMethods.convertCSS(cssClass)
        );
      });
    },
    assignMethods: () => {
      document.querySelectorAll(`[${this.selectors.event}]`).forEach(element => {
        let event = element.getAttribute(this.selectors.event).split(",");
        element.addEventListener(event[0].trim(), this.methods[event[1].trim()]);
      });
    },
    createReactiveData: (parent) => {
      let element = {
        id: count,
        element: parent,
      }

      this.count++;

      parent.childNodes.forEach(child => {
        if (child.nodeType == 1) {
          return this.privateMethods.createReactiveData(child, count+1);
        } else if (child.nodeType == 3) {
          element.bind = child.wholeText.split("{{")
            .filter(item => item.indexOf("}}") > 0)
            .map(text => {
              return text.slice(0,text.indexOf("}}"));
            });
          if (!element.bind.length) delete element.bind;
        }
      });

      parent.setAttribute(this.selectors.id, element.id);
      this.reactiveElements.push(element);
    },
    update: (key = false) => {
      this.reactiveElements.filter(element => {
        if (element.bind != undefined) {
          if (key) {
            return element.bind == key;
          } else {
            return element.bind;
          }
        }
      }).forEach(element => {
        let state = key ? key : element.bind;
        this.target().querySelector(`[${this.selectors.id}="${element.id}"]`).textContent = this.state[state];
      });
    }
  });

  return this.public = ({
    init: () => {
      // Build HTML
      this.privateMethods.buildHTML();
      this.privateMethods.createReactiveData(this.html);
      this.target().appendChild(this.html.cloneNode(true));

      // Assign CSS
      this.privateMethods.initCSS();

      // Assign Click events
      this.privateMethods.assignMethods();

      // Start
      this.privateMethods.update();
    }
  });
}

let app = Mane();
app.init();