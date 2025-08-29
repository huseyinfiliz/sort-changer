import app from 'flarum/admin/app';

app.initializers.add('huseyinfiliz-sort-changer', () => {
  app.extensionData
    .for('huseyinfiliz-sort-changer')
    .registerSetting({
      setting: 'huseyinfiliz-sort-changer.default_sort',
      label: app.translator.trans('huseyinfiliz-sort-changer.admin.settings.default_sort_label'),
      type: 'select',
      options: {
        'latest': app.translator.trans('huseyinfiliz-sort-changer.admin.settings.sort_latest'),
        'top': app.translator.trans('huseyinfiliz-sort-changer.admin.settings.sort_top'),
        'newest': app.translator.trans('huseyinfiliz-sort-changer.admin.settings.sort_newest'),
        'oldest': app.translator.trans('huseyinfiliz-sort-changer.admin.settings.sort_oldest')
      },
      default: 'latest'
    });
});