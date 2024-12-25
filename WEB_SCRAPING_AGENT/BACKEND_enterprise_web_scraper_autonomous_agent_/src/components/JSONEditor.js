import React from 'react';
    import ReactJson from 'react-json-view';

    function JSONEditor({ label, name, value, onChange }) {
      return (
        <div>
          <label>{label}</label>
          <ReactJson
            src={value}
            onEdit={(edit) => onChange(name, edit.updated_src)}
            onAdd={(add) => onChange(name, add.updated_src)}
            onDelete={(del) => onChange(name, del.updated_src)}
            displayObjectSize={false}
            enableClipboard={false}
            style={{ marginBottom: '16px' }}
          />
        </div>
      );
    }

    export default JSONEditor;
