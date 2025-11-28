<script setup>
import ListItem from "@tiptap/extension-list-item";
import TextStyle from "@tiptap/extension-text-style";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import { Editor, EditorContent } from "@tiptap/vue-3";
import { ref, watch, onMounted, onBeforeUnmount } from "vue";

// Import the SlashCommands extension and its helper functions
import { SlashCommands } from "../extensions/SlashCommands";
import suggestion from "../extensions/suggestion";

const props = defineProps({
  modelValue: {
    type: String,
    default: `
        <h2>
          Hi there,
        </h2>
        <p>Type / to see available commands</p>
      `,
  },
});

const emit = defineEmits(["update:modelValue"]);

const editor = ref(null);

onMounted(() => {
  editor.value = new Editor({
    extensions: [
      TextStyle.configure({ types: [ListItem.name] }),
      StarterKit,
      SlashCommands.configure({
        suggestion,
      }),
      Placeholder.configure({
        placeholder: "Write something here",
      }),
    ],
    content: props.modelValue,
    onUpdate: ({ editor }) => {
      emit("update:modelValue", editor.getHTML());
    },
  });
});

// Keep editor content in sync if prop changes externally
watch(
  () => props.modelValue,
  (value) => {
    if (editor.value && editor.value.getHTML() !== value) {
      editor.value.commands.setContent(value || "", false);
    }
  }
);

onBeforeUnmount(() => {
  editor.value?.destroy();
});
</script>

<template>
  <div v-if="editor" class="tiptap-editor-container">
    <div class="editor-help-text">Type <code>/</code> for commands</div>
    <editor-content :editor="editor" class="editor-content" />
  </div>
</template>

<style lang="scss">
.tiptap-editor-container {
  @apply bg-zinc-900 border border-zinc-700 rounded-lg shadow-md px-2 py-4 transition-all duration-200;
  /* stronger focus state */
  &:focus-within {
    @apply bg-zinc-800 ring-2 ring-zinc-700 ring-opacity-50;
  }

  .editor-help-text {
    @apply text-gray-400 mb-2 text-sm;
    code {
      @apply bg-gray-700 text-gray-200 px-1 rounded;
    }
  }

  .editor-content {
    @apply prose prose-invert max-w-none min-h-[250px] outline-none;
    padding: 0.5rem;
    /* ensure no default outline on focus */
    &:focus-within {
      outline: none;
      border: none;
    }

    /* custom scrollbar */
    &::-webkit-scrollbar {
      width: 8px;
    }
    &::-webkit-scrollbar-track {
      background: transparent;
    }
    &::-webkit-scrollbar-thumb {
      background: rgba(255, 255, 255, 0.2);
      border-radius: 4px;
    }
  }

  /* Typography tweaks */
  .ProseMirror p {
    margin: 0.75rem 0;
    line-height: 1.6;
  }
  .ProseMirror h1,
  .ProseMirror h2,
  .ProseMirror h3 {
    margin-top: 2rem;
    margin-bottom: 1rem;
    line-height: 1.2;
  }
  .ProseMirror h1 {
    font-size: 1.6rem;
  }
  .ProseMirror h2 {
    font-size: 1.4rem;
  }
  .ProseMirror h3 {
    font-size: 1.2rem;
  }
  .ProseMirror h4,
  .ProseMirror h5,
  .ProseMirror h6 {
    font-size: 1rem;
  }

  /* Lists */
  .ProseMirror ul,
  .ProseMirror ol {
    margin: 1rem 0 1rem 1.25rem;
    padding-left: 0;
    li {
      margin: 0.25rem 0;
      p {
        margin: 0;
      }
    }
  }

  /* Blockquote */
  .ProseMirror blockquote {
    border-left: 3px solid rebeccapurple;
    padding-left: 1rem;
    color: #ddd;
    margin: 1rem 0;
  }

  /* Horizontal rule */
  .ProseMirror hr {
    border: none;
    border-top: 1px solid #555;
    margin: 2rem 0;
  }

  /* Code inline & blocks */
  .ProseMirror code {
    background-color: var(--purple-light);
    color: var(--black);
    padding: 0.2em 0.4em;
    border-radius: 0.3rem;
    font-size: 0.9em;
  }
  .ProseMirror pre {
    background: #111;
    padding: 1rem;
    border-radius: 0.5rem;
    font-family: "JetBrainsMono", monospace;
    margin: 1.5rem 0;
    overflow: auto;
    code {
      background: none;
      color: #fff;
      font-size: 0.85em;
      padding: 0;
    }
  }
  .ProseMirror-focused {
    outline: none;
  }
}

.tiptap p.is-editor-empty::before {
  color: #adb5bd; /* Placeholder text color */
  content: attr(data-placeholder); /* Placeholder content */
  float: left;
  height: 0;
  pointer-events: none; /* Prevent interaction */
}

/* Slash command menu styling */
.slash-command-popup {
  border-radius: 0.5rem;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
  overflow: hidden;
}

.slash-command-list {
  background: #1f2937;
  border-radius: 0.5rem;
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

  &:hover,
  &.is-selected {
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
}

/* Suggestion highlight */
.suggestion {
  background-color: rgba(255, 255, 255, 0.1);
  border-radius: 0.25rem;
}
</style>
