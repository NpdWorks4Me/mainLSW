import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getProduct, formatCurrency } from '@/api/EcommerceApi';
import LazyImage from '@/components/LazyImage';
import { Button } from '@/components/ui/button';
import { useCart } from '@/hooks/useCart';
import PageHelmet from '@/components/PageHelmet';

export default function ProductDetailPage(){
	const { id } = useParams();
	const navigate = useNavigate();
	const [product, setProduct] = useState(null);
	const [loading, setLoading] = useState(true);
	const { addToCart } = useCart();

	useEffect(() => {
		let mounted = true;
		async function fetch() {
			try {
				setLoading(true);
				const res = await getProduct(id);
				if (mounted) setProduct(res);
			} catch (e) {
				console.error('Product load failed', e);
			} finally {
				if (mounted) setLoading(false);
			}
		}
		fetch();
		return () => { mounted = false };
	}, [id]);

	if (loading) return <div className="py-32 text-center">Loading...</div>;
	if (!product) return <div className="py-32 text-center">Product not found</div>;

	const variant = product.variants && product.variants[0];
	const price = variant ? formatCurrency(variant.price_in_cents, variant.currency_info) : '';

	const handleAdd = async () => {
		await addToCart(product, variant, 1);
		navigate('/cart');
	}

	return (
		<main className="max-w-5xl mx-auto px-4 py-12">
			<PageHelmet title={product.title || 'Product'} />
			<div className="grid grid-cols-1 md:grid-cols-2 gap-8">
				<div>
					<LazyImage src={product.image || (product.images && product.images[0]?.url)} alt={product.title} className="w-full h-auto rounded-xl" />
				</div>
				<div>
					<h1 className="text-2xl font-bold mb-2">{product.title}</h1>
					<p className="text-purple-200 mb-4">{product.subtitle || ''}</p>
					<div className="text-2xl font-semibold mb-6">{price}</div>
					<div className="mb-6 text-purple-200" dangerouslySetInnerHTML={{ __html: product.description || '' }} />
					<div className="flex gap-4">
						<Button size="lg" onClick={handleAdd}>Add to cart</Button>
						<Button variant="ghost" onClick={() => navigate(-1)}>Back</Button>
					</div>
				</div>
			</div>
		</main>
	);
}
