import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Project } from '../types/project';
import Navbar from '../components/Navbar';

interface ProjectFormData {
  title: string;
  description: string;
  status: string;
  budgetedCost: string;
  sourceOfFunds: string;
  department: string;
  directorate: string;
  contractName: string;
  lpoNumber: string;
  contractNumber: string;
  contractor: string;
  contractPeriod: string;
  contractStartDate: string;
  contractEndDate: string;
  contractCost: string;
  implementationStatus: string;
  recommendations: string;
  pmc: string;
  constituency: string;
  ward: string;
  financialYear: string;
  images: File[];
  progress?: number;
  amountPaidToDate?: number;
}

const ProjectForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [imagePreviewUrls, setImagePreviewUrls] = useState<string[]>([]);
  
  const [formData, setFormData] = useState<ProjectFormData>({
    title: '',
    description: '',
    status: 'not_started',
    budgetedCost: '',
    sourceOfFunds: '',
    department: '',
    directorate: '',
    contractName: '',
    lpoNumber: '',
    contractNumber: '',
    contractor: '',
    contractPeriod: '',
    contractStartDate: '',
    contractEndDate: '',
    contractCost: '',
    implementationStatus: '',
    recommendations: '',
    pmc: '',
    constituency: '',
    ward: '',
    financialYear: '',
    images: [],
    progress: 0
  });

  useEffect(() => {
    if (id) {
      // Fetch project data if editing
      const fetchProject = async () => {
        try {
          setLoading(true);
          // TODO: Replace with actual API call
          // Mock data for now
          const mockProject = {
            id: '1',
            title: 'Water Supply Project - Phase 1',
            description: 'Installation of water supply infrastructure in rural areas',
            status: 'ongoing',
            budgetedCost: 5000000,
            sourceOfFunds: 'County Development Fund',
            progress: 65,
            department: 'Water and Sanitation',
            directorate: 'Water Resources',
            contractName: 'Rural Water Supply Initiative 2024',
            lpoNumber: 'LPO-2024-001',
            contractNumber: 'CNT-2024-001',
            contractor: 'Maji Solutions Ltd',
            contractPeriod: '12 months',
            contractStartDate: '2024-01-15',
            contractEndDate: '2025-01-14',
            contractCost: 4800000,
            implementationStatus: 'On Schedule',
            recommendations: 'Project progressing well, maintain current pace',
            pmc: 'Water Development Committee',
            constituency: 'Kiharu',
            ward: 'Township',
            financialYear: '2024/2025',
            images: [
              '/images/projects/water-supply-1.jpg',
              '/images/projects/water-supply-2.jpg',
            ]
          };

          setFormData({
            ...mockProject,
            budgetedCost: mockProject.budgetedCost.toString(),
            contractCost: mockProject.contractCost.toString(),
            images: [],
            progress: mockProject.progress
          });
          
          // Set image previews for existing images
          setImagePreviewUrls(mockProject.images);
        } catch (error) {
          console.error('Error fetching project:', error);
        } finally {
          setLoading(false);
        }
      };

      fetchProject();
    }
  }, [id]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setFormData(prev => ({
      ...prev,
      images: [...prev.images, ...files]
    }));

    // Create preview URLs for new images
    const newPreviewUrls = files.map(file => URL.createObjectURL(file));
    setImagePreviewUrls(prev => [...prev, ...newPreviewUrls]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      // Prepare the data (convert numbers, etc.)
      const payload = {
        ...formData,
        budgetedCost: Number(formData.budgetedCost),
        contractCost: Number(formData.contractCost),
        progress: Number(formData.progress) || 0,
        amountPaidToDate: Number(formData.amountPaidToDate) || 0,
        // Add any other necessary conversions
      };
      // Send to backend
      const token = localStorage.getItem('token');
      const url = id ? `/api/projects/${id}` : '/api/projects';
      const method = id ? 'PUT' : 'POST';
      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Failed to add project');
      }
      navigate('/staff');
    } catch (error) {
      console.error('Error submitting project:', error);
      // Optionally, show an error message to the user
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 mt-24">
        <div className="md:grid md:grid-cols-3 md:gap-6">
          <div className="md:col-span-1">
            <div className="px-4 sm:px-0">
              <h3 className="text-lg font-medium leading-6 text-gray-900">
                {id ? 'Edit Project' : 'New Project'}
              </h3>
              <p className="mt-1 text-sm text-gray-600">
                Fill in the project details. All fields marked with * are required.
              </p>
            </div>
          </div>
          
          <div className="mt-5 md:mt-0 md:col-span-2">
            <form onSubmit={handleSubmit}>
              <div className="shadow sm:rounded-md sm:overflow-hidden">
                <div className="px-4 py-5 bg-white space-y-6 sm:p-6">
                  {/* Basic Information */}
                  <div className="grid grid-cols-6 gap-6">
                    <div className="col-span-6 sm:col-span-4">
                      <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                        Project Title *
                      </label>
                      <input
                        type="text"
                        name="title"
                        id="title"
                        required
                        value={formData.title}
                        onChange={handleInputChange}
                        className="mt-1 focus:ring-green-500 focus:border-green-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                      />
                    </div>

                    <div className="col-span-6">
                      <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                        Description *
                      </label>
                      <textarea
                        id="description"
                        name="description"
                        rows={3}
                        required
                        value={formData.description}
                        onChange={handleInputChange}
                        className="mt-1 focus:ring-green-500 focus:border-green-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                      />
                    </div>

                    <div className="col-span-6 sm:col-span-3">
                      <label htmlFor="status" className="block text-sm font-medium text-gray-700">
                        Status *
                      </label>
                      <select
                        id="status"
                        name="status"
                        required
                        value={formData.status}
                        onChange={handleInputChange}
                        className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                      >
                        <option value="not_started">Not Started</option>
                        <option value="ongoing">Ongoing</option>
                        <option value="completed">Completed</option>
                        <option value="stalled">Stalled</option>
                        <option value="under_procurement">Under Procurement</option>
                      </select>
                    </div>

                    <div className="col-span-6 sm:col-span-3">
                      <label htmlFor="financialYear" className="block text-sm font-medium text-gray-700">
                        Financial Year *
                      </label>
                      <select
                        id="financialYear"
                        name="financialYear"
                        required
                        value={formData.financialYear}
                        onChange={handleInputChange}
                        className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                      >
                        <option value="">Select Year</option>
                        <option value="2024/2025">2024/2025</option>
                        <option value="2023/2024">2023/2024</option>
                        <option value="2022/2023">2022/2023</option>
                      </select>
                    </div>
                  </div>

                  {/* Location Information */}
                  <div className="grid grid-cols-6 gap-6">
                    <div className="col-span-6 sm:col-span-3">
                      <label htmlFor="constituency" className="block text-sm font-medium text-gray-700">
                        Constituency *
                      </label>
                      <select
                        id="constituency"
                        name="constituency"
                        required
                        value={formData.constituency}
                        onChange={handleInputChange}
                        className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                      >
                        <option value="">Select Constituency</option>
                        <option value="Kangema">Kangema</option>
                        <option value="Mathioya">Mathioya</option>
                        <option value="Kiharu">Kiharu</option>
                        <option value="Kigumo">Kigumo</option>
                        <option value="Maragwa">Maragwa</option>
                        <option value="Kandara">Kandara</option>
                        <option value="Gatanga">Gatanga</option>
                      </select>
                    </div>

                    <div className="col-span-6 sm:col-span-3">
                      <label htmlFor="ward" className="block text-sm font-medium text-gray-700">
                        Ward *
                      </label>
                      <input
                        type="text"
                        name="ward"
                        id="ward"
                        required
                        value={formData.ward}
                        onChange={handleInputChange}
                        className="mt-1 focus:ring-green-500 focus:border-green-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                      />
                    </div>
                  </div>

                  {/* Contract Information */}
                  <div className="grid grid-cols-6 gap-6">
                    <div className="col-span-6 sm:col-span-3">
                      <label htmlFor="department" className="block text-sm font-medium text-gray-700">
                        Department *
                      </label>
                      <input
                        type="text"
                        name="department"
                        id="department"
                        required
                        value={formData.department}
                        onChange={handleInputChange}
                        className="mt-1 focus:ring-green-500 focus:border-green-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                      />
                    </div>

                    <div className="col-span-6 sm:col-span-3">
                      <label htmlFor="directorate" className="block text-sm font-medium text-gray-700">
                        Directorate
                      </label>
                      <input
                        type="text"
                        name="directorate"
                        id="directorate"
                        value={formData.directorate}
                        onChange={handleInputChange}
                        className="mt-1 focus:ring-green-500 focus:border-green-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                      />
                    </div>

                    <div className="col-span-6 sm:col-span-3">
                      <label htmlFor="budgetedCost" className="block text-sm font-medium text-gray-700">
                        Budgeted Cost (KES) *
                      </label>
                      <input
                        type="number"
                        name="budgetedCost"
                        id="budgetedCost"
                        required
                        value={formData.budgetedCost}
                        onChange={handleInputChange}
                        className="mt-1 focus:ring-green-500 focus:border-green-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                      />
                    </div>

                    <div className="col-span-6 sm:col-span-3">
                      <label htmlFor="sourceOfFunds" className="block text-sm font-medium text-gray-700">
                        Source of Funds *
                      </label>
                      <input
                        type="text"
                        name="sourceOfFunds"
                        id="sourceOfFunds"
                        required
                        value={formData.sourceOfFunds}
                        onChange={handleInputChange}
                        className="mt-1 focus:ring-green-500 focus:border-green-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                      />
                    </div>
                  </div>

                  {/* Contract Details */}
                  <div className="grid grid-cols-6 gap-6">
                    <div className="col-span-6 sm:col-span-3">
                      <label htmlFor="contractName" className="block text-sm font-medium text-gray-700">
                        Contract Name *
                      </label>
                      <input
                        type="text"
                        name="contractName"
                        id="contractName"
                        required
                        value={formData.contractName}
                        onChange={handleInputChange}
                        className="mt-1 focus:ring-green-500 focus:border-green-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                      />
                    </div>

                    <div className="col-span-6 sm:col-span-3">
                      <label htmlFor="contractor" className="block text-sm font-medium text-gray-700">
                        Contractor *
                      </label>
                      <input
                        type="text"
                        name="contractor"
                        id="contractor"
                        required
                        value={formData.contractor}
                        onChange={handleInputChange}
                        className="mt-1 focus:ring-green-500 focus:border-green-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                      />
                    </div>

                    <div className="col-span-6 sm:col-span-3">
                      <label htmlFor="contractStartDate" className="block text-sm font-medium text-gray-700">
                        Start Date *
                      </label>
                      <input
                        type="date"
                        name="contractStartDate"
                        id="contractStartDate"
                        required
                        value={formData.contractStartDate}
                        onChange={handleInputChange}
                        className="mt-1 focus:ring-green-500 focus:border-green-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                      />
                    </div>

                    <div className="col-span-6 sm:col-span-3">
                      <label htmlFor="contractEndDate" className="block text-sm font-medium text-gray-700">
                        End Date *
                      </label>
                      <input
                        type="date"
                        name="contractEndDate"
                        id="contractEndDate"
                        required
                        value={formData.contractEndDate}
                        onChange={handleInputChange}
                        className="mt-1 focus:ring-green-500 focus:border-green-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                      />
                    </div>
                  </div>

                  {/* Project Images */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Project Images
                    </label>
                    <div className="mt-2 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                      <div className="space-y-1 text-center">
                        <svg
                          className="mx-auto h-12 w-12 text-gray-400"
                          stroke="currentColor"
                          fill="none"
                          viewBox="0 0 48 48"
                          aria-hidden="true"
                        >
                          <path
                            d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                            strokeWidth={2}
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                        <div className="flex text-sm text-gray-600">
                          <label
                            htmlFor="images"
                            className="relative cursor-pointer bg-white rounded-md font-medium text-green-600 hover:text-green-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-green-500"
                          >
                            <span>Upload files</span>
                            <input
                              id="images"
                              name="images"
                              type="file"
                              multiple
                              accept="image/*"
                              className="sr-only"
                              onChange={handleImageChange}
                            />
                          </label>
                          <p className="pl-1">or drag and drop</p>
                        </div>
                        <p className="text-xs text-gray-500">
                          PNG, JPG, GIF up to 10MB each
                        </p>
                      </div>
                    </div>
                    
                    {/* Image Previews */}
                    {imagePreviewUrls.length > 0 && (
                      <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
                        {imagePreviewUrls.map((url, index) => (
                          <div key={index} className="relative">
                            <img
                              src={url}
                              alt={`Preview ${index + 1}`}
                              className="h-24 w-full object-cover rounded-lg"
                            />
                            <button
                              type="button"
                              onClick={() => {
                                const newUrls = [...imagePreviewUrls];
                                newUrls.splice(index, 1);
                                setImagePreviewUrls(newUrls);
                                
                                const newImages = [...formData.images];
                                newImages.splice(index, 1);
                                setFormData(prev => ({
                                  ...prev,
                                  images: newImages
                                }));
                              }}
                              className="absolute top-0 right-0 -mt-2 -mr-2 h-6 w-6 rounded-full bg-red-500 text-white flex items-center justify-center hover:bg-red-600 focus:outline-none"
                            >
                              ×
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <div className="px-4 py-3 bg-gray-50 text-right sm:px-6">
                  <button
                    type="button"
                    onClick={() => navigate('/staff')}
                    className="mr-3 inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
                  >
                    {loading ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        Saving...
                      </>
                    ) : (
                      'Save Project'
                    )}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectForm; 