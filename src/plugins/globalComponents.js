import {
  BaseInput,
  Card,
  Modal,
  BaseDropdown,
  BaseButton,
  BaseCheckbox,
  BaseRadio,
  FormBuilder,
} from "../components/index";
import CheckboxGroup from "../components/FormBuilder/CheckboxGroup.vue";
import RadioGroup from "../components/FormBuilder/RadioGroup.vue";

/**
 * You can register global components here and use them as a plugin in your main Vue instance
 */

const GlobalComponents = {
  install(Vue) {
    Vue.component(BaseInput.name, BaseInput);
    Vue.component(Card.name, Card);
    Vue.component(Modal.name, Modal);
    Vue.component(BaseDropdown.name, BaseDropdown);
    Vue.component(BaseButton.name, BaseButton);
    Vue.component(BaseCheckbox.name, BaseCheckbox);
    Vue.component(BaseRadio.name, BaseRadio);
    Vue.component(FormBuilder.name, FormBuilder);
    Vue.component("checkbox-group", CheckboxGroup);
    Vue.component("radio-group", RadioGroup);
  },
};

export default GlobalComponents;
