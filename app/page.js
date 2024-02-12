import ApiRequestField from "@/components/ApiRequestField";

export default function Home() {
  const handleApiCall = async (data) => {
    "use server"
    const url = new URL(data.url)
    if (data.method === "GET") {
      if (Object.keys(data.body || {})) {
        url.search = new URLSearchParams(data.body)
      }
    }
    let body = JSON.stringify(data.body)
    if (data.bodyType === "form-data") {
      console.log("first")
      let formData = new FormData()
      Object.keys(data.body).forEach(item => {
        formData.append(data.body[item])
      })
      body = formData
    }

    const response = await fetch(data.url, {
      headers: data.headers,
      ...(data.method !== "GET" ? { body } : {}),
      method: data.method
    })
    const res = await response.json()
    return res
  }
  return (
    <main className="100w m-9 flex justify-center items-center">
      <ApiRequestField handleApiCall={handleApiCall} />
    </main>
  );
}
