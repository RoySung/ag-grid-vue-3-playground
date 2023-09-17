export default {
  template: `
        <div :class="cssClass" style="margin: 20px;">
            <button @click="clicked()">Click</button>
            {{message}}
        </div>    `,
  data() {
    return {
      cssClass: "",
      message: ""
    };
  },
  beforeMount() {
    this.cssClass = "example-full-width-pinned-row";
    this.message = `Normal full width row at index`;
  },
  methods: {
    clicked() {
      alert("button clicked");
    }
  }
};
