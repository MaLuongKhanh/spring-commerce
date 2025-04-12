import React, { useState, useEffect } from 'react';
import axiosInstance from '../api/axiosInstance';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { ProgressSpinner } from 'primereact/progressspinner';

// Define an interface for the Product structure based on your DTO
interface Product {
    id: number;
    name: string;
    description: string;
    price: number;
    brand: string;
    color: string;
    categoryId: number;
}

const ProductList: React.FC = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            setError(null);
            try {
                // For now, we fetch without authentication. 
                // We need to implement login first to get a token.
                const response = await axiosInstance.get('/products'); 
                // Note: The backend API might return paginated data.
                // For simplicity, we assume it returns a simple array or Page object.
                // Adjust this based on your actual API response structure.
                if (response.data && Array.isArray(response.data.content)) {
                    setProducts(response.data.content);
                } else if (Array.isArray(response.data)) { // Handle non-paginated array
                    setProducts(response.data);
                 } else {
                    console.error("Unexpected API response format:", response.data);
                    setProducts([]); // Set to empty array if format is wrong
                }
            } catch (err: any) {
                console.error("Error fetching products:", err);
                setError('Failed to fetch products. Please try again later.');
                if (err.response && err.response.status === 401) {
                    setError('Authentication required. Please log in.');
                    // TODO: Redirect to login page or show login prompt
                }
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []); // Empty dependency array means this runs once on mount

    if (loading) {
        return (
            <div className="flex justify-content-center align-items-center" style={{ height: '300px' }}>
                <ProgressSpinner />
            </div>
        );
    }

    if (error) {
        return <div className="p-error text-center">{error}</div>;
    }

    // Helper function to format currency
    const formatCurrency = (value: number) => {
        return value.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
    };

    return (
        <div className="card">
            <h2>Product List</h2>
            <DataTable value={products} tableStyle={{ minWidth: '50rem' }} paginator rows={10}>
                <Column field="id" header="ID" sortable></Column>
                <Column field="name" header="Name" sortable filter filterPlaceholder="Search by name"></Column>
                <Column field="description" header="Description"></Column>
                <Column field="price" header="Price" sortable body={(rowData) => formatCurrency(rowData.price)}></Column>
                <Column field="brand" header="Brand" sortable filter filterPlaceholder="Search by brand"></Column>
                <Column field="color" header="Color" sortable></Column>
                {/* Add more columns as needed, e.g., Category */}
            </DataTable>
        </div>
    );
};

export default ProductList;
