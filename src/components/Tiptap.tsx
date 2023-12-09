import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import React from 'react';

const Tiptap = ({
  description,
  onChange,
}: {
  description: string;
  onChange: (richText: string) => void;
}) => {
  const editor = useEditor({
    extensions: [StarterKit],
    content: description,
    onUpdate({ editor }) {
      onChange(editor.getHTML());
      console.log(editor.getHTML());
    },
  });

  return <EditorContent editor={editor} />;
};

export default Tiptap;
