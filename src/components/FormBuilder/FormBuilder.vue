<template>
  <div
    class="form-builder"
    :class="{ 'bg-white': isLightMode, 'navbar-transparent': !isLightMode }"
  >
    <div class="row">
      <!-- Components Sidebar -->
      <div class="col-md-3">
        <card>
          <h4 slot="header">Form Components</h4>
          <base-input
            v-model="formName"
            placeholder="Enter form name"
            label="Form Name"
          />
          <div class="components-list">
            <div
              v-for="component in basicComponents"
              :key="component.type"
              class="component-item"
              draggable="true"
              @dragstart="dragStart($event, component)"
            >
              <i :class="component.icon"></i>
              {{ component.label }}
            </div>
            <h5 class="mt-4">Advanced Elements</h5>
            <div
              v-for="component in advancedComponents"
              :key="component.type"
              class="component-item"
              draggable="true"
              @dragstart="dragStart($event, component)"
            >
              <i :class="component.icon"></i>
              {{ component.label }}
            </div>
          </div>
        </card>
      </div>

      <!-- Form Preview Area -->
      <div class="col-md-6">
        <card>
          <div
            class="d-flex justify-content-between align-items-center"
            slot="header"
          >
            <h4>Form Preview</h4>
            <div class="preview-controls">
              <base-button size="sm" @click="previewForm">
                <i class="tim-icons icon-mobile"></i> Preview
              </base-button>
              <base-button size="sm" @click="exportForm">
                <i class="tim-icons icon-cloud-download-93"></i> Create Form
              </base-button>
            </div>
          </div>
          <div
            class="form-preview"
            @dragover.prevent
            @drop="dropComponent($event)"
          >
            <draggable
              v-model="formFields"
              group="fields"
              :animation="200"
              ghost-class="ghost-field"
              drag-class="drag-field"
              handle=".form-field-wrapper"
            >
              <div
                v-for="(field, index) in formFields"
                :key="field.id"
                class="form-field-wrapper"
                :class="{ 'is-selected': selectedFieldIndex === index }"
                @click="selectField(index)"
              >
                <div class="field-controls">
                  <i
                    class="tim-icons icon-pencil"
                    @click="editField(index)"
                  ></i>
                  <i
                    class="tim-icons icon-simple-remove"
                    @click="removeField(index)"
                  ></i>
                </div>
                <component
                  :is="field.component"
                  v-bind="field.props"
                  :label="field.label"
                />
              </div>
            </draggable>
          </div>
        </card>
      </div>

      <!-- Properties Panel -->
      <div class="col-md-3">
        <card>
          <h4 slot="header">Properties</h4>
          <div v-if="selectedFieldIndex !== null">
            <base-input
              v-model="selectedField.label"
              label="Field Label"
              placeholder="Enter field label"
            />
            <template
              v-if="['text', 'number', 'textarea'].includes(selectedField.type)"
            >
              <base-input
                v-model="selectedField.props.placeholder"
                label="Placeholder"
                placeholder="Enter placeholder text"
              />
              <base-checkbox
                v-model="selectedField.props.required"
                class="mt-3"
              >
                Required field
              </base-checkbox>
            </template>
            <template v-if="selectedField.type === 'number'">
              <base-input
                type="number"
                v-model.number="selectedField.props.min"
                label="Minimum Value"
                placeholder="Enter minimum value"
              />
              <base-input
                type="number"
                v-model.number="selectedField.props.max"
                label="Maximum Value"
                placeholder="Enter maximum value"
              />
            </template>
            <template
              v-if="
                selectedField.type === 'checkbox_group' ||
                selectedField.type === 'radio_group'
              "
            >
              <base-input
                v-model="selectedField.props.groupLabel"
                label="Group Label"
                placeholder="Enter group label"
              />
              <base-input
                v-model="selectedField.props.groupName"
                label="Individual Item Label"
                placeholder="Enter label for individual items"
                @input="updateGroupLabel"
              />
              <div v-if="selectedField.props.options">
                <h6 class="mt-3">Options</h6>
                <div
                  v-for="(option, optIndex) in selectedField.props.options"
                  :key="optIndex"
                >
                  <div class="d-flex align-items-center mb-2">
                    <base-input
                      v-model="option.label"
                      placeholder="Option label"
                      class="mr-2"
                    />
                    <i
                      class="tim-icons icon-simple-remove"
                      @click="removeOption(optIndex)"
                    ></i>
                  </div>
                </div>
                <base-button
                  class="btn-simple btn-block mt-2"
                  @click="addOption"
                >
                  <i class="tim-icons icon-simple-add"></i> Add Option
                </base-button>
              </div>
            </template>
          </div>
          <div v-else class="text-center">
            <p>Select a field to edit its properties</p>
          </div>
        </card>
      </div>
    </div>

    <!-- Preview Modal -->
    <modal :show.sync="showPreviewModal" :class="modalClass">
      <h4 slot="header">Form Preview</h4>
      <form @submit.prevent="handlePreviewSubmit">
        <div v-for="(field, index) in formFields" :key="index">
          <component
            :key="index"
            :is="field.component"
            v-model="previewData[field.props.name]"
            v-bind="field.props"
            :label="field.label"
            :props="field.props"
          />
        </div>
        <div class="text-center">
          <base-button type="submit">Submit</base-button>
        </div>
      </form>
    </modal>
  </div>
</template>

<script>
import axios from "axios";
import draggable from "vuedraggable";

export default {
  name: "form-builder",
  components: {
    draggable,
  },
  getCurrentUser() {
    return JSON.parse(localStorage.getItem("user"));
  },
  data() {
    return {
      formName: "",
      formFields: [],
      selectedFieldIndex: null,
      showPreviewModal: false,
      previewData: {},
      basicComponents: [
        {
          type: "text",
          component: "base-input",
          label: "Text Input",
          icon: "tim-icons icon-pencil",
          defaultProps: {
            type: "text",
            placeholder: "Enter text",
            name: "text_input",
            label: "Text Input",
            value: "",
            required: false,
          },
        },
        {
          type: "number",
          component: "base-input",
          label: "Number Input",
          icon: "tim-icons icon-mobile",
          defaultProps: {
            type: "number",
            placeholder: "Enter number",
            name: "number_input",
            label: "Number Input",
            value: null,
            required: false,
            min: null,
            max: null,
          },
        },
        {
          type: "textarea",
          component: "base-input",
          label: "Text Area",
          icon: "tim-icons icon-caps-small",
          defaultProps: {
            type: "textarea",
            placeholder: "Enter long text",
            name: "textarea",
            label: "Text Area",
            value: "",
            rows: 4,
            required: false,
          },
        },
      ],
      advancedComponents: [
        {
          type: "checkbox_group",
          component: "checkbox-group",
          label: "Checkbox Group",
          icon: "tim-icons icon-check-2",
          defaultProps: {
            name: "checkbox_group",
            groupName: "Default Group",
            groupLabel: "Checkbox Group",
            options: [
              { label: "Option 1", value: "", name: "" },
              { label: "Option 2", value: "", name: "" },
            ],
          },
        },
        {
          type: "radio_group",
          component: "radio-group",
          label: "Radio Group",
          icon: "tim-icons icon-circle",
          defaultProps: {
            name: "radio_group",
            groupName: "Default Group",
            groupLabel: "Radio Group",
            options: [
              { label: "Option 1", value: "", name: "" },
              { label: "Option 2", value: "", name: "" },
            ],
          },
        },
      ],
    };
  },
  computed: {
    selectedField() {
      return this.selectedFieldIndex !== null
        ? this.formFields[this.selectedFieldIndex]
        : null;
    },
    isLightMode() {
      return document.body.classList.contains("white-content");
    },
    modalClass() {
      return this.isLightMode ? "modal-light" : "modal-dark";
    },
  },
  methods: {
    dragStart(event, component) {
      const componentCopy = JSON.parse(JSON.stringify(component));
      event.dataTransfer.setData(
        "application/json",
        JSON.stringify(componentCopy)
      );
    },
    dropComponent(event) {
      try {
        const componentData = JSON.parse(
          event.dataTransfer.getData("application/json")
        );

        const newField = {
          ...componentData,
          id: `field_${Date.now()}`,
          label: componentData.label,
          props: {
            ...componentData.defaultProps,
            name: `${componentData.type}_${Date.now()}`,
            groupLabel:
              componentData.defaultProps.groupLabel || "Default Group Label",
            options: componentData.defaultProps.options || [],
          },
        };

        this.formFields.push(newField);
      } catch (error) {
        console.error("Error adding component:", error);
      }
    },
    selectField(index) {
      this.selectedFieldIndex = index;
    },
    removeField(index) {
      this.formFields.splice(index, 1);
      if (this.selectedFieldIndex === index) {
        this.selectedFieldIndex = null;
      }
    },
    editField(index) {
      this.selectedFieldIndex = index;
    },
    addOption() {
      if (this.selectedField && this.selectedField.props.options) {
        const newOption = {
          label: `Option ${this.selectedField.props.options.length + 1}`,
          value: `option_${Date.now()}`,
        };
        this.selectedField.props.options.push(newOption);
      }
    },
    removeOption(index) {
      if (this.selectedField && this.selectedField.props.options) {
        this.selectedField.props.options.splice(index, 1);
      }
    },
    modelChange(value) {
      return this.isDarkMode ? "dark" : "light";
    },
    previewForm() {
      this.previewData = {};
      this.formFields.forEach((field) => {
        if (field.type === "checkbox_group") {
          this.previewData[field.props.name] = [];
        } else if (field.type === "radio_group") {
          this.previewData[field.props.name] = "";
        } else {
          this.previewData[field.props.name] = "";
        }
      });
      this.showPreviewModal = true;
    },
    exportForm() {
      console.log(this.formFields);
      if (this.formName) {
        const payload = this.formFields?.map((el, key) => {
          return {
            id: el.id,
            fieldType: el.type,
            label:
              el.type != "text" && el.type != "number" && el.type != "textarea"
                ? el.props.groupLabel
                : el.label,
            name:
              el.type != "text" && el.type != "number" && el.type != "textarea"
                ? el.props.groupLabel
                : el.label,
            value: el.defaultProps.value,
            isRequired: el.defaultProps.required,
            placeholder: el.defaultProps.placeholder,
            options: el.defaultProps.options?.map((option) => {
              return {
                label: option.label,
                value: option.label,
                name: el.props.groupLabel,
              };
            }),
            order: key,
          };
        });
        const formConfig = {
          id: "",
          name: this.formName,
          createdByUserId: JSON.parse(localStorage.getItem("user")).userId,
          fields: payload,
        };
        axios
          .post(`http://localhost:5143/api/Forms`, formConfig)
          .then((res) => {
            console.log(res);
          });
      } else {
        this.$notify({
          type: "danger",
          message: "Form name is required",
          icon: "tim-icons icon-alert-circle-exc",
          verticalAlign: "top",
          horizontalAlign: "right",
        });
      }
    },
    handlePreviewSubmit() {
      console.log("Form Data:", this.previewData);
      this.showPreviewModal = false;
    },
    updateGroupLabel(value) {
      if (this.selectedField) {
        this.selectedField.props.groupName = value;
      }
    },
  },
};
</script>

<style lang="scss" scoped>
@import "../../assets/sass/black-dashboard/custom/variables";

.form-builder {
  .components-list {
    .component-item {
      padding: 10px;
      margin: 5px 0;
      background: rgba($color: #ffffff, $alpha: 0.1);
      border-radius: $border-radius-lg;
      cursor: move;

      i {
        margin-right: 10px;
      }

      &:hover {
        background: rgba($color: #ffffff, $alpha: 0.2);
      }
    }
  }

  .form-field-wrapper {
    position: relative;
    padding: 15px;
    margin: 10px 0;
    background: rgba($color: #ffffff, $alpha: 0.05);
    border-radius: $border-radius-lg;
    border: 2px solid transparent;

    &.is-selected {
      border-color: $primary;
    }

    .field-controls {
      position: absolute;
      top: 10px;
      right: 10px;
      opacity: 0;
      transition: opacity 0.3s;

      i {
        margin-left: 10px;
        cursor: pointer;

        &:hover {
          color: $primary;
        }
      }
    }

    &:hover .field-controls {
      opacity: 1;
    }
  }

  .ghost-field {
    opacity: 0.5;
    background: rgba($color: #ffffff, $alpha: 0.1);
    border: 2px dashed $primary;
  }

  .drag-field {
    opacity: 0.8;
  }

  .form-preview {
    min-height: 200px;
    padding: 20px;
    border: 2px dashed rgba($color: #ffffff, $alpha: 0.2);
    border-radius: $border-radius-lg;

    &.dragover {
      border-color: $primary;
      background: rgba($color: #ffffff, $alpha: 0.05);
    }
  }

  .modal-light {
    .modal-content {
      background-color: #ffffff;
      color: #000000;
    }
  }

  .modal-dark {
    .modal-content {
      background-color: #1a1e34;
      color: #ffffff;
    }
  }
}
</style>
