import { ConfigProvider } from "antd";
import Router from "./Router"
import { QueryClient, QueryClientProvider } from "react-query";
const queryClient = new QueryClient();

function App() {
  return <QueryClientProvider client={queryClient}>
    <ConfigProvider>
      <Router />
    </ConfigProvider>
  </QueryClientProvider>
}

export default App
