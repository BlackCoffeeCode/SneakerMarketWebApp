import { useState } from "react";
import api from "../../services/api";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Upload, Check } from "lucide-react";
import AdminLayout from "../../components/admin/AdminLayout";
import Button from "../../components/ui/Button";

const AdminAddProduct = () => {
  const [formData, setFormData] = useState({
    name: "",
    brand: "",
    price: "",
    description: "",

    image: "",
    // Sustainability
    carbonFootprint: "",
    recycledMaterial: "",
    repairable: false,
    wears: ""
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setFormData({ ...formData, [e.target.name]: value });
  };

  const generateSKU = () => {
    // Basic random SKU generator for UI convenience
    const brand = formData.brand || "GEN";
    const name = formData.name || "PROD";
    const brandCode = brand.substring(0, 3).toUpperCase();
    const nameCode = name.replace(/[^a-zA-Z]/g, '').substring(0, 3).toUpperCase();
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    return `${brandCode}-${nameCode}-${randomNum}`;
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await api.post("/sneakers", {
        name: formData.name,
        brand: formData.brand || "Nike",
        price: Number(formData.price),
        images: [formData.image],
        description: formData.description,
        sizes: [7, 8, 9, 10, 11, 12],
        sku: generateSKU(), // Auto-generate on submit
        sustainability: {
          carbonFootprint: Number(formData.carbonFootprint) || 0,
          recycledMaterial: Number(formData.recycledMaterial) || 0,
          repairable: formData.repairable,
          wears: Number(formData.wears) || 300
        }
      });

      // navigate("/admin/products");
      // Optional: Show success feedback before redirecting
      alert("Product added successfully!");
      navigate("/seller/products");

    } catch (error) {
      console.error("Failed to add product", error);
      alert("Failed to add product");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout>
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => navigate('/seller/products')}
            className="p-2 bg-white dark:bg-gray-800 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors border border-gray-200 dark:border-gray-700"
          >
            <ArrowLeft size={20} className="text-gray-500" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Add New Product</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">Create a new sneaker listing</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left: Input Form */}
          <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm p-6 sm:p-8">
            <form onSubmit={submitHandler} className="space-y-6">
              <div>
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Product Name</label>
                <input
                  name="name"
                  placeholder="e.g. Air Jordan 1 Retro"
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border-none rounded-xl text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 transition-all font-medium"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Brand</label>
                  <input
                    name="brand"
                    placeholder="e.g. Nike"
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border-none rounded-xl text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 transition-all font-medium"
                    value={formData.brand}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Price (₹)</label>
                  <input
                    name="price"
                    type="number"
                    placeholder="12999"
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border-none rounded-xl text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 transition-all font-medium"
                    value={formData.price}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Description</label>
                <textarea
                  name="description"
                  rows="4"
                  placeholder="Product description..."
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border-none rounded-xl text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 transition-all font-medium resize-none"
                  value={formData.description}
                  onChange={handleChange}
                />
              </div>

              {/* Sustainability Section */}
              <div className="pt-4 border-t border-gray-100 dark:border-gray-800">
                <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-4">Sustainability Impact 🌍</h3>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Carbon (kg CO2e)</label>
                    <input
                      name="carbonFootprint"
                      type="number"
                      placeholder="e.g. 8.5"
                      className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border-none rounded-xl text-gray-900 dark:text-white"
                      value={formData.carbonFootprint}
                      onChange={handleChange}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Recycled Mat. (%)</label>
                    <input
                      name="recycledMaterial"
                      type="number"
                      placeholder="e.g. 40"
                      max="100"
                      className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border-none rounded-xl text-gray-900 dark:text-white"
                      value={formData.recycledMaterial}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 items-center">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Est. Lifespan (Wears)</label>
                    <input
                      name="wears"
                      type="number"
                      placeholder="e.g. 500"
                      className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border-none rounded-xl text-gray-900 dark:text-white"
                      value={formData.wears}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="flex items-center pt-6">
                    <label className="flex items-center space-x-3 cursor-pointer">
                      <input
                        type="checkbox"
                        name="repairable"
                        checked={formData.repairable}
                        onChange={handleChange}
                        className="w-5 h-5 rounded text-primary-600 focus:ring-primary-500 bg-gray-100 border-gray-300 dark:bg-gray-700 dark:border-gray-600"
                      />
                      <span className="text-gray-900 dark:text-white font-medium">Repairable Design</span>
                    </label>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Image URL</label>
                <div className="flex gap-2">
                  <input
                    name="image"
                    placeholder="https://..."
                    className="flex-1 px-4 py-3 bg-gray-50 dark:bg-gray-800 border-none rounded-xl text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 transition-all font-medium"
                    value={formData.image}
                    onChange={handleChange}
                  />
                  <div className="w-12 flex items-center justify-center bg-gray-100 dark:bg-gray-800 rounded-xl text-gray-400">
                    <Upload size={20} />
                  </div>
                </div>
              </div>

              <Button type="submit" className="w-full py-4 text-base mt-2" disabled={loading}>
                {loading ? "Creating..." : "Create Product"}
              </Button>
            </form>
          </div>

          {/* Right: Live Preview */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider ml-1">Live Preview</h3>
            <div className="bg-white dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-xl overflow-hidden p-6 relative group">
              <div className="aspect-[4/5] bg-gray-50 dark:bg-gray-800/50 rounded-2xl mb-6 relative overflow-hidden flex items-center justify-center">
                {formData.image ? (
                  <img
                    src={formData.image}
                    alt="Preview"
                    className="w-full h-full object-contain mix-blend-multiply dark:mix-blend-normal transform group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div className="text-gray-400 flex flex-col items-center">
                    <Upload size={48} className="mb-2 opacity-50" />
                    <span className="text-sm font-medium">No Image</span>
                  </div>
                )}
              </div>

              <div>
                <p className="text-primary-600 font-bold text-xs uppercase tracking-widest mb-2">{formData.brand || 'Brand'}</p>
                <h3 className="text-2xl font-black text-gray-900 dark:text-white mb-2 leading-tight">
                  {formData.name || 'Product Name'}
                </h3>
                <p className="text-xl font-bold text-gray-900 dark:text-white">
                  ₹{formData.price || '0'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminAddProduct;
