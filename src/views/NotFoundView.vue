<template>
  <div class="search-container">
    <v-autocomplete
      v-model="selectedOption"
      :items="searchOptions"
      :filter="customFilter"
      label="Search"
      dense
      hide-details
      clearable
      @update:modelValue="handleOptionChange"
      @keyup.enter="handleEnterKey"
      :menu-props="{ closeOnContentClick: true }"
    >
      <template v-slot:no-data>
        <span>No matches found. Add a new option?</span
        ><v-btn icon small @click="showNewOptionInput = true">
          <v-icon>mdi-plus</v-icon>
        </v-btn>
      </template>
    </v-autocomplete>

    <v-text-field
      v-if="showNewOptionInput"
      v-model="newOption"
      label="New option"
      dense
      @keyup.enter="addNewOption"
      @blur="showNewOptionInput = false"
    ></v-text-field>
  </div>
</template>

<script>
export default {
  data() {
    return {
      searchOptions: ["Option 1", "Option 2", "Option 3"],
      selectedOption: null,
      newOption: "",
      showNewOptionInput: false,
    };
  },
  methods: {
    customFilter(item, query) {
      return (
        item.toLowerCase().includes(query.toLowerCase()) ||
        (query === " " && item === "New Option")
      );
    },
    handleOptionChange(newValue) {
      if (newValue === "New Option") {
        this.addNewOption();
        this.showNewOptionInput = true;
      }
    },
    addNewOption() {
      if (this.newOption.trim() !== "") {
        this.searchOptions.push(this.newOption.trim());
        this.selectedOption = this.newOption.trim();
        this.newOption = "";
      }
    },
    handleEnterKey() {
      // Perform your search logic here
      // using this.selectedOption
      console.log(`Search for: ${this.selectedOption}`);
    },
  },
};
</script>
