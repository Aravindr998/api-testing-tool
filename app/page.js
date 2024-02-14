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
      let formData = new FormData()
      Object.keys(data.body).forEach(item => {
        formData.append(data.body[item])
      })
      body = formData
    }

    try {
      const response = await fetch(data.url, {
        headers: data.headers,
        ...(data.method !== "GET" ? { body } : {}),
        method: data.method,
        cache: "no-store"
      })
      const contentType = response.headers.get("content-type")
      const statusCode = response.status
      let res
      let cType
      if (contentType?.includes("application/json")) {
        res = await response.json();
        cType = "json"
      } else if (contentType?.includes("text/html")) {
        res = await response.text();
        cType = "html"
      } else if (contentType?.includes("application/x-www-form-urlencoded")) {
        res = await response.formData();
        cType = "application/x-www-form-urlencoded"
      } else if (contentType?.includes("application/octet-stream")) {
        res = await response.arrayBuffer();
        cType = "application/octet-stream"
      } else {
        res = await response.blob();
      }
      return {
        response: res,
        status: statusCode,
        contentType: cType
      }

    } catch (error) {
      console.log(error)
      return {
        response: error,
        status: 500
      }
    }

  }
  return (
    <main className="100w m-9 flex justify-center items-center">
      <ApiRequestField handleApiCall={handleApiCall} />
    </main>
  );
}
