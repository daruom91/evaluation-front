<template>
  <div class="content">
    <div class="row">
      <div class="col-12">
        <card>
          <h5 slot="header" class="title">Form Builder</h5>
          <form-builder />
        </card>
      </div>
    </div>
  </div>
</template>

<script>
import FormBuilder from "@/components/FormBuilder/FormBuilder.vue";

export default {
  components: {
    FormBuilder,
  },
};
</script>
