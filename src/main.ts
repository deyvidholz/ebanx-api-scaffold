import { createApp } from './app';

const PORT = process.env.PORT ?? 8080;

createApp().listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`API docs available at http://localhost:${PORT}/docs`);
});
