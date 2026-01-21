import React, { useState } from 'react'
import { Card } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'
import { useDropzone } from 'react-dropzone'
import { useApp } from '../contexts/AppContext'
import { 
  Upload, 
  FileText, 
  Code, 
  Sparkles,
  Download,
  Copy,
  Eye
} from 'lucide-react'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'

export const Generate: React.FC = () => {
  const { addProject, incrementUsage } = useApp()
  const [code, setCode] = useState('')
  const [language, setLanguage] = useState('javascript')
  const [projectName, setProjectName] = useState('')
  const [generating, setGenerating] = useState(false)
  const [documentation, setDocumentation] = useState('')
  const [files, setFiles] = useState<File[]>([])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      'text/*': ['.js', '.ts', '.py', '.java', '.cpp', '.c', '.php', '.rb', '.go', '.rs']
    },
    onDrop: (acceptedFiles) => {
      setFiles(acceptedFiles)
      // Read the first file and set as code
      if (acceptedFiles.length > 0) {
        const reader = new FileReader()
        reader.onload = (e) => {
          setCode(e.target?.result as string)
          setProjectName(acceptedFiles[0].name.split('.')[0])
        }
        reader.readAsText(acceptedFiles[0])
      }
    }
  })

  const generateDocumentation = async () => {
    if (!code.trim()) {
      toast.error('Please provide some code to document')
      return
    }

    if (!projectName.trim()) {
      toast.error('Please provide a project name')
      return
    }

    setGenerating(true)
    
    // Simulate API call to generate documentation
    setTimeout(() => {
      const mockDocumentation = `# ${projectName} Documentation

## Overview
This ${language} project provides essential functionality for modern applications. The implementation follows industry best practices and includes comprehensive error handling, performance optimizations, and maintainable code structure.

## Architecture
The codebase is organized with a clear separation of concerns, making it easy to understand, test, and maintain.

## Functions

### main()
The main function serves as the entry point for the application.

**Parameters:**
- None

**Returns:**
- \`void\` - No return value

**Example:**
\`\`\`${language}
main()
\`\`\`

### processData(data)
Processes the input data and returns formatted results with comprehensive validation.

**Parameters:**
- \`data\` (${language === 'javascript' ? 'Object' : 'any'}) - The input data to process

**Returns:**
- \`${language === 'javascript' ? 'Object' : 'any'}\` - Processed data object with validation results

**Example:**
\`\`\`${language}
const result = processData(inputData);
console.log(result);
\`\`\`

### validateInput(input)
Validates input parameters to ensure data integrity.

**Parameters:**
- \`input\` (any) - Input to validate

**Returns:**
- \`boolean\` - True if valid, false otherwise

## Installation

\`\`\`bash
# Clone the repository
git clone https://github.com/yourname/${projectName.toLowerCase()}

# Install dependencies
npm install

# Run the application
npm start
\`\`\`

## Usage

To use this code in your project:

1. Import the necessary functions
2. Initialize the application by calling main()
3. Use processData() to handle your data processing needs
4. Implement proper error handling as shown in the examples

## Configuration

The application supports various configuration options:

- **Environment Variables**: Set up your environment variables in \`.env\`
- **Config Files**: Modify \`config.json\` for application settings
- **Database**: Configure your database connection in the settings

## Error Handling

The code includes comprehensive error handling for:
- Invalid input parameters
- Network failures and timeouts
- File system errors
- Database connection issues
- Memory management

## Performance Considerations

- Uses efficient algorithms for data processing (O(n log n) complexity)
- Implements caching for repeated operations
- Optimized for large datasets (tested with 1M+ records)
- Memory-efficient data structures
- Lazy loading for improved startup time

## Testing

Run the test suite:

\`\`\`bash
npm test
\`\`\`

The project includes:
- Unit tests for all functions
- Integration tests for API endpoints
- Performance benchmarks
- Code coverage reports

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support and questions:
- Create an issue on GitHub
- Email: support@${projectName.toLowerCase()}.com
- Documentation: https://docs.${projectName.toLowerCase()}.com
`

      setDocumentation(mockDocumentation)
      
      // Add project to the app state
      addProject({
        name: projectName,
        language,
        lastModified: new Date().toISOString(),
        status: 'completed',
        fileCount: files.length || 1,
        size: files.length > 0 ? `${(files[0].size / 1024 / 1024).toFixed(1)} MB` : '0.5 MB',
        documentation: mockDocumentation
      })
      
      // Increment usage stats
      incrementUsage('apiCalls', 1)
      incrementUsage('storage', 0.1)
      
      setGenerating(false)
      toast.success('Documentation generated successfully!')
    }, 3000)
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(documentation)
    toast.success('Documentation copied to clipboard!')
  }

  const downloadDocs = () => {
    const blob = new Blob([documentation], { type: 'text/markdown' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${projectName || 'documentation'}.md`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    toast.success('Documentation downloaded!')
  }

  const resetForm = () => {
    setCode('')
    setProjectName('')
    setFiles([])
    setDocumentation('')
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
          Generate Documentation
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Upload your code or paste it below to generate comprehensive documentation using AI
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input Section */}
        <Card className="p-6 space-y-6">
          <div className="flex items-center space-x-2">
            <Code className="h-5 w-5 text-purple-600" />
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
              Input Code
            </h2>
          </div>

          {/* Project Name */}
          <Input
            label="Project Name"
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
            placeholder="Enter project name..."
          />

          {/* File Upload */}
          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer ${
              isDragActive
                ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20'
                : 'border-gray-300 dark:border-gray-600 hover:border-purple-400'
            }`}
          >
            <input {...getInputProps()} />
            <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 dark:text-gray-400">
              {isDragActive
                ? 'Drop your code files here...'
                : 'Drag & drop code files here, or click to select'}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">
              Supports: .js, .ts, .py, .java, .cpp, .c, .php, .rb, .go, .rs
            </p>
          </div>

          {files.length > 0 && (
            <div className="space-y-2">
              <h3 className="font-medium text-gray-900 dark:text-gray-100">Uploaded Files:</h3>
              {files.map((file, index) => (
                <div key={index} className="flex items-center space-x-2 p-2 bg-gray-50 dark:bg-gray-700 rounded">
                  <FileText className="h-4 w-4 text-gray-500" />
                  <span className="text-sm text-gray-700 dark:text-gray-300">{file.name}</span>
                  <span className="text-xs text-gray-500">({(file.size / 1024).toFixed(1)} KB)</span>
                </div>
              ))}
            </div>
          )}

          {/* Language Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Programming Language
            </label>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="javascript">JavaScript</option>
              <option value="typescript">TypeScript</option>
              <option value="python">Python</option>
              <option value="java">Java</option>
              <option value="cpp">C++</option>
              <option value="c">C</option>
              <option value="php">PHP</option>
              <option value="ruby">Ruby</option>
              <option value="go">Go</option>
              <option value="rust">Rust</option>
            </select>
          </div>

          {/* Code Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Code
            </label>
            <textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="Paste your code here..."
              rows={12}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 font-mono text-sm"
            />
          </div>

          <div className="flex space-x-3">
            <Button
              onClick={generateDocumentation}
              loading={generating}
              disabled={!code.trim() || !projectName.trim()}
              className="flex-1"
              size="lg"
            >
              <Sparkles className="h-5 w-5 mr-2" />
              Generate Documentation
            </Button>
            <Button
              variant="outline"
              onClick={resetForm}
              disabled={generating}
            >
              Reset
            </Button>
          </div>
        </Card>

        {/* Output Section */}
        <Card className="p-6 space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <FileText className="h-5 w-5 text-blue-600" />
              <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                Generated Documentation
              </h2>
            </div>
            
            {documentation && (
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={copyToClipboard}
                >
                  <Copy className="h-4 w-4 mr-2" />
                  Copy
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={downloadDocs}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </Button>
              </div>
            )}
          </div>

          {generating ? (
            <div className="flex items-center justify-center p-12">
              <div className="text-center">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  className="h-12 w-12 border-4 border-purple-500 border-t-transparent rounded-full mx-auto mb-4"
                />
                <p className="text-gray-600 dark:text-gray-400 mb-2">
                  AI is analyzing your code and generating documentation...
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-500">
                  This may take a few moments
                </p>
              </div>
            </div>
          ) : documentation ? (
            <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4 overflow-auto max-h-96">
              <pre className="text-sm text-gray-800 dark:text-gray-200 whitespace-pre-wrap">
                {documentation}
              </pre>
            </div>
          ) : (
            <div className="flex items-center justify-center p-12 text-gray-500 dark:text-gray-400">
              <div className="text-center">
                <Eye className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Generated documentation will appear here</p>
                <p className="text-sm mt-2">Fill in the form and click generate to start</p>
              </div>
            </div>
          )}
        </Card>
      </div>
    </div>
  )
}