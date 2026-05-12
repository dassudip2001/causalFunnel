import app from "./app";
import { PORT } from "./config/enverment";

app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
});
