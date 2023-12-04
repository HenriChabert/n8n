import { createApp } from 'vue';
import App from './Popup.vue';
import { setupApp } from '~/logic/common-setup';
import 'n8n-design-system/css/index.scss';

const app = createApp(App);
setupApp(app);
app.mount('#app');
