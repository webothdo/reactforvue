<script setup>
import { ref } from "vue";

const props = defineProps({
  items: {
    type: Array,
    required: true,
  },
  command: {
    type: Function,
    required: true,
  },
});

const selectedIndex = ref(0);

const selectItem = (index) => {
  selectedIndex.value = index;
};

const onKeyDown = ({ event }) => {
  if (event.key === "ArrowUp") {
    event.preventDefault();
    selectedIndex.value =
      (selectedIndex.value + props.items.length - 1) % props.items.length;
    return true;
  }

  if (event.key === "ArrowDown") {
    event.preventDefault();
    selectedIndex.value = (selectedIndex.value + 1) % props.items.length;
    return true;
  }

  if (event.key === "Enter") {
    event.preventDefault();
    const item = props.items[selectedIndex.value];
    if (item) {
      props.command(item);
    }
    return true;
  }

  return false;
};

defineExpose({
  onKeyDown,
});
</script>

<template>
  <div class="slash-command-list">
    <div class="items">
      <button
        v-for="(item, index) in items"
        :key="item.title"
        class="item"
        :class="{ 'is-selected': index === selectedIndex }"
        @click="command(item)"
        @mouseenter="selectItem(index)"
      >
        <div class="item-icon">{{ item.icon }}</div>
        <div class="item-title">{{ item.title }}</div>
      </button>
    </div>
  </div>
</template>

<style scoped>
.slash-command-list {
  background: #1f2937;
  border-radius: 0.5rem;
  box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.05), 0px 10px 20px rgba(0, 0, 0, 0.1);
  color: #fff;
  overflow: hidden;
  max-width: 320px;
  z-index: 100;
}

.items {
  max-height: 300px;
  overflow-y: auto;
  padding: 0.25rem;
}

.item {
  align-items: center;
  border-radius: 0.4rem;
  color: #fff;
  cursor: pointer;
  display: flex;
  font-size: 0.9rem;
  gap: 0.5rem;
  margin: 0;
  padding: 0.5rem;
  text-align: left;
  width: 100%;
  background: transparent;
  border: none;
}

.item:hover,
.item.is-selected {
  background-color: rgba(255, 255, 255, 0.1);
}

.item-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 1.5rem;
  height: 1.5rem;
  border-radius: 0.25rem;
  background-color: rgba(255, 255, 255, 0.1);
}

.item-title {
  flex: 1;
}
</style>
