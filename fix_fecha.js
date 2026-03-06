const fs = require('fs');

function replaceOrWarn(content, search, replace, label) {
	if (content.includes(search)) {
		console.log('✓', label);
		return content.replace(search, replace);
	}
	console.log('✗', label, '- NOT found');
	return content;
}

const viewPath = 'c:/Users/Guillote/Desktop/ALTROMONDO/licenciasTrabajo/webapp/views/Main/License/License.view.js';
let view = fs.readFileSync(viewPath, 'utf8');

const t7 = '\t\t\t\t\t\t\t';

// Remove duplicate Inhibicion change handler (the one before "enabled:")
view = replaceOrWarn(view,
	t7 + 'change: $.proxy(oController.handleDateChange, oController, "InhibicionTableJsonModel"),\n' +
	t7 + 'enabled: {',
	t7 + 'enabled: {',
	'Inhibicion: remove duplicate change handler before enabled'
);

// Remove duplicate Habilitacion change handler (the one before "enabled:")
view = replaceOrWarn(view,
	t7 + 'change: $.proxy(oController.handleDateChange, oController, "HabilitacionTableJsonModel"),\n' +
	t7 + 'enabled: {',
	t7 + 'enabled: {',
	'Habilitacion: remove duplicate change handler before enabled'
);

fs.writeFileSync(viewPath, view, 'utf8');
console.log('View saved.');
