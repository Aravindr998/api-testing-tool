"use client"
import React, { useEffect, useRef, useState } from 'react'
import Editor, { useMonaco } from '@monaco-editor/react'

const ApiRequestField = ({ handleApiCall, res }) => {
    const [requestParams, setRequestParams] = useState({
        headers: [{ key: "", value: "" }, { key: "", value: "" }],
        body: [{ key: "", value: "" }, { key: "", value: "" }]
    })
    const [activeTab, setActiveTab] = useState("headers")
    const [bodyType, setBodyType] = useState("Default")
    const [response, setResponse] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const [jsonBody, setJsonBody] = useState("")
    const [error, setError] = useState("")

    useEffect(() => {
        if (res) {
            setResponse(res)
        }
    }, [res])
    const monaco = useMonaco()
    useEffect(() => {
        if (monaco)
            setEditorTheme()
    }, [monaco])
    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            setError("")
            setIsLoading(true)
            const formData = new FormData(e.target)
            if (!formData.get("url")) return
            const markers = monaco.editor.getModelMarkers()
            if (markers.length) {
                setError("Invalid JSON")
                return
            }
            const requestHeaders = requestParams.headers.reduce((acc, { key, value }) => {
                if (key) {
                    acc[key] = value
                }
                return acc
            }, {})
            let requestBody = requestParams.body.reduce((acc, { key, value }) => {
                if (key) {
                    acc[key] = value
                }
                return acc
            }, {})
            if (bodyType === "json") {
                requestBody = JSON.parse(jsonBody)
            }
            console.log(requestBody)
            console.log(formData.get("url"), formData.get("method"), requestHeaders, requestBody)
            const response = await handleApiCall({
                url: formData.get("url"),
                method: formData.get("method"),
                headers: requestHeaders,
                body: requestBody,
                bodyType
            })
            setResponse(response)
        } catch (error) {
            console.log(error)
        } finally {
            setIsLoading(false)
        }
    }
    const httpMethods = ["GET", "POST", "PUT", "DELETE", "PATCH"]
    const handleParamsChange = (index, field, e) => {
        setRequestParams(prevState => {
            const newState = { ...prevState }
            newState[activeTab][index][field] = e.target.value
            return newState
        })
    }
    const getTabClass = (key) => {
        if (key.toLowerCase() === activeTab) return "border-blue-500"
        return "border-gray-700"
    }
    const switchTab = (key) => {
        setActiveTab(key)
    }
    const handleAddRow = () => {
        setRequestParams(prevState => {
            const newState = { ...prevState }
            newState[activeTab] = [...prevState[activeTab], { key: "", value: "" }]
            return newState
        })
    }
    const classNames = {
        string: "text-blue-500",
        number: "text-amber-400",
        boolean: "text-purple-500",
        null: "text-rose-500",
        key: "text-sky-400"
    }

    function syntaxHighlight(json) {
        if (typeof json != 'string') {
            json = JSON.stringify(json, undefined, 2);
        }
        json = json.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
        return json.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, function (match) {
            let cls = classNames.number;
            if (/^"/.test(match)) {
                if (/:$/.test(match)) {
                    cls = classNames.key;
                } else {
                    cls = classNames.string;
                }
            } else if (/true|false/.test(match)) {
                cls = classNames.boolean;
            } else if (/null/.test(match)) {
                cls = classNames.null;
            }
            return '<span class="' + cls + '">' + match + '</span>';
        });
    }
    const handleBodyTypeChange = (e) => {
        setBodyType(e.target.value)
    }
    function setEditorTheme() {
        monaco.editor.defineTheme('onedark', {
            base: 'vs-dark',
            inherit: true,
            rules: [
                { token: 'delimiter.curly', foreground: '#ffffff' },
                { token: 'delimiter.square', foreground: '#ffffff' },
                { token: 'delimiter.parenthesis', foreground: '#ffffff' }
            ],
            colors: {
                'editor.background': '#111827'
            }
        });
        monaco.editor.setTheme("onedark")
    }
    const handleEditorChange = (value, evet) => {
        setError("")
        setJsonBody(value)
    }
    return (
        <div className='md:w-6/12 w-full md:text-md text-xs'>
            <form onSubmit={handleSubmit} className='text-black w-full'>
                <select name='method' className='p-2 mr-1 border rounded border-blue-500 bg-gray-900 text-white w-2/12'>
                    {
                        httpMethods.map(item => <option key={item} value={item}>{item}</option>)
                    }
                </select>
                <input type='text' name='url' className='p-2 border rounded-l border-blue-500 bg-gray-900 text-white w-7/12 focus:bg-gray-700' placeholder='URL' />
                <button type='submit' className='bg-blue-500 p-2 border border-blue-500 rounded-r w-2/12 text-white' >Submit</button>
            </form>
            <div className='w-11/12'>
                <div className='flex mt-6'>
                    {
                        ["headers", "body"].map(item => {
                            return (
                                <div key={item} className={`border-l border-r border-t rounded-t p-2 min-w-24 text-center ${getTabClass(item)} cursor-pointer`} onClick={() => switchTab(item)}>
                                    <h1 className='capitalize'>{item}</h1>
                                </div>
                            )
                        })
                    }
                </div>
                {(activeTab !== "body" || bodyType !== "json") ? <table className='border-2 w-full border-collapse border-blue-500'>
                    <thead>
                        <tr>
                            <th className='border border-gray-700'><span>Key</span></th>
                            <th className='border border-gray-700'><span>Value</span></th>
                        </tr>
                    </thead>
                    <tbody className='text-black'>
                        {
                            requestParams[activeTab].map((item, index) => {
                                return (
                                    <tr key={index} className='text-white'>
                                        <td className='border border-gray-700'>
                                            <input className='w-full bg-gray-900 focus:outline focus:outline-blue-500 p-2' type='text' name={`keyInput${index}`} value={requestParams[activeTab][index]?.key} onChange={(e) => handleParamsChange(index, "key", e)} />
                                        </td>
                                        <td className='border border-gray-700'>
                                            <input className='w-full border-none bg-gray-900 focus:outline focus:outline-blue-500 p-2' type='text' name={`valueInput${index}`} value={requestParams[activeTab][index]?.value} onChange={(e) => handleParamsChange(index, "value", e)} />
                                        </td>
                                    </tr>
                                )
                            })
                        }
                    </tbody>
                </table>
                    :
                    <div className='w-full'>
                        <Editor className='border rounded border-blue-500' theme='onedark' height={"30vh"} defaultLanguage='json' value={jsonBody} onChange={handleEditorChange} />
                        {error && <div className='w-full border bg-red-600 bg-opacity-40 border-red-900 p-1 mt-1'>
                            <p className='text-red-200 text-sm'>{error}</p>
                        </div>}
                    </div>}
                <div className={`flex justify-${activeTab === "body" ? "between" : "end"} items-center`}>
                    {activeTab === "body" && <div className='flex gap-2'>
                        {
                            ["Default", "form-data", "json"].map(item => {
                                return (
                                    <div key={item}>
                                        <input type='radio' id={item} name='bodyType' value={item} onChange={handleBodyTypeChange} checked={bodyType === item} />
                                        <label for={item}>{item}</label>
                                    </div>
                                )
                            })
                        }
                    </div>}
                    {(activeTab !== "body" || bodyType !== "json") && <button className='bg-blue-500 p-2 rounded mt-2' onClick={handleAddRow}>Add Row</button>}
                </div>
            </div>
            <div className='w-11/12 h-64 mt-10 '>

                <div className='w-full h-full overflow-scroll border rounded border-gray-700 relative resize-y'>
                    {isLoading && <div className='absolute top-0 right-0 left-0 bottom-0 flex justify-center align bg-blue-900 bg-opacity-35 backdrop-blur-sm'>
                        <img className='absolute top-2/4 right-2/4 translate-x-2/4 -translate-y-2/4 w-20 ' src='/loader.gif' />
                    </div>}
                    {response && <pre className='text-sm' dangerouslySetInnerHTML={{ __html: syntaxHighlight(JSON.stringify(response, undefined, 4)) }} />}
                </div>
            </div>
        </div>
    )
}

export default ApiRequestField