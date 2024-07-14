import React, { useEffect, useRef, useState } from 'react';
import EditorJS from '@editorjs/editorjs';
import Header from '@editorjs/header';
import Quote from '@editorjs/quote';
import Delimiter from '@editorjs/delimiter';
import List from '@editorjs/list';
import Paragraph from '@editorjs/paragraph';
import Image from '@editorjs/image';
import Marker from '@editorjs/marker';
import Title from 'title-editorjs';
import Table from '@editorjs/table';
import DragDrop from 'editorjs-drag-drop';

const EditorComponent = () => {
  const editorInstance = useRef(null);
  const [editorData, setEditorData] = useState(null);

  const initEditor = (data = null) => {
    const editor = new EditorJS({
      holder: 'editorjs',
      tools: {
        header: {
          class: Header,
          inlineToolbar: true,
        },
        quote: {
          class: Quote,
          inlineToolbar: true,
          shortcut: 'CMD+SHIFT+O',
          config: {
            quotePlaceholder: 'Enter a quote',
            captionPlaceholder: 'Quote\'s author',
          },
        },
        table: {
          class: Table,
          inlineToolbar: true,
          config: {
            rows: 2,
            cols: 3,
          },
        },
        delimiter: Delimiter,
        title: Title,
        list: {
          class: List,
          inlineToolbar: true,
        },
        paragraph: {
          class: Paragraph,
          inlineToolbar: true,
        },
        image: {
          class: Image,
          config: {
            endpoints: {
              byFile: 'http://localhost:8008/uploadFile', // Your backend file uploader endpoint
              byUrl: 'http://localhost:8008/fetchUrl', // Your endpoint that provides uploading by URL
            },
            field: 'image', // Ensure the field name matches here
          },
        },
        Marker: {
          class: Marker,
          shortcut: 'CMD+SHIFT+M',
        },
      },
      data: data || {
        blocks: [
          {
            type: 'header',
            data: {
              text: 'Editor.js',
              level: 1,
            },
          },
          {
            type: 'paragraph',
            data: {
              text: 'Hey. Meet the new Editor. On this page you can see it in action — try to edit this text.',
            },
          },
        ],
      },
      onReady: () => {
        new DragDrop(editor); // Initialize drag and drop
      },
    });

    editorInstance.current = editor;
  };

  useEffect(() => {
    initEditor(editorData);

    return () => {
      if (editorInstance.current) {
        editorInstance.current.isReady
          .then(() => {
            editorInstance.current.destroy();
            editorInstance.current = null;
          })
          .catch((error) => console.error('Editor.js cleanup error:', error));
      }
    };
  }, [editorData]);

  const handleSave = async () => {
    if (editorInstance.current) {
      const savedData = await editorInstance.current.save();
      setEditorData(savedData);

      const dataStr = JSON.stringify(savedData, null, 2);
      const blob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'editor-data.json';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);

      console.log('Saved data: ', dataStr);
    }
  };

  return (
    <div>
      <div>
        <button onClick={handleSave}>Save as JSON</button>
      </div>
      <div id="editorjs" />
    </div>
  );
};

export default EditorComponent;
