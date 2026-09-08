'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import {
  Lock,
  LogOut,
  Package,
  ShoppingBag,
  Plus,
  Edit,
  Trash2,
  CheckCircle2,
  X,
  Database,
  Cloud,
  RefreshCw,
  AlertCircle,
  Search,
  Eye,
  EyeOff,
  Sliders,
  Tag,
  FileText,
  Truck,
  ExternalLink,
  Download,
  Check,
  Smartphone,
} from 'lucide-react';
import { getAllProducts, Product } from '@/lib/products';
import {
  getSupabaseBrowserClient,
  isSupabaseConfigured,
  saveProductToSupabase,
  deleteProductFromSupabase,
  mapSupabaseRowToProduct,
  fetchOrdersFromSupabase,
  updateOrderStatusInSupabase,
  SupabaseOrder,
  fetchPromoCodesFromSupabase,
  savePromoCodeToSupabase,
  togglePromoCodeStatus,
  SupabasePromoCode,
  fetchSiteSettings,
  saveSiteSetting,
  DEFAULT_SITE_SETTINGS,
} from '@/lib/supabase';

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<'products' | 'orders' | 'cms' | 'promos'>('products');

  // Supabase Status
  const [supabaseConnected, setSupabaseConnected] = useState<boolean>(false);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [syncMessage, setSyncMessage] = useState<string | null>(null);

  // Products State
  const [productsList, setProductsList] = useState<Product[]>([]);
  const [productSearch, setProductSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  // Product Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProductId, setEditingProductId] = useState<number | null>(null);
  const [name, setName] = useState('');
  const [nameEn, setNameEn] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState<'silk' | 'satin' | 'velvet' | 'seasonal' | 'accessories'>('silk');
  const [categoryLabel, setCategoryLabel] = useState('100% Jedwab Morwowy (19 Momme)');
  const [material, setMaterial] = useState('100% Jedwab Morwowy (19 Momme)');
  const [description, setDescription] = useState('');
  const [stock, setStock] = useState('10');
  const [imageUrl, setImageUrl] = useState('');
  const [images, setImages] = useState<string[]>([]);
  const [colors, setColors] = useState<Array<{ name: string; hex: string }>>([
    { name: 'Obsidian Black', hex: '#0A0A0A' },
  ]);

  // Orders State
  const [ordersList, setOrdersList] = useState<SupabaseOrder[]>([]);
  const [orderSearch, setOrderSearch] = useState('');
  const [isUpdatingOrder, setIsUpdatingOrder] = useState<number | null>(null);

  // Promo Codes State
  const [promosList, setPromosList] = useState<SupabasePromoCode[]>([]);
  const [newPromoCode, setNewPromoCode] = useState('');
  const [newPromoRate, setNewPromoRate] = useState('10');
  const [isAddingPromo, setIsAddingPromo] = useState(false);

  // Site Settings CMS State
  const [siteSettings, setSiteSettings] = useState<Record<string, string>>(DEFAULT_SITE_SETTINGS);
  const [isSavingSettings, setIsSavingSettings] = useState(false);
  const [settingsSuccessMsg, setSettingsSuccessMsg] = useState<string | null>(null);


  // Load all initial data from Supabase
  const loadAllData = async () => {
    setIsSyncing(true);
    const client = getSupabaseBrowserClient();

    if (!client) {
      setSupabaseConnected(false);
      setProductsList(getAllProducts());
      setIsSyncing(false);
      return;
    }

    try {
      // 1. Products
      const { data: prodData, error: prodErr } = await client
        .from('products')
        .select('*')
        .order('id', { ascending: true });

      if (prodData && prodData.length > 0) {
        setProductsList(prodData.map(mapSupabaseRowToProduct));
        setSupabaseConnected(true);
      } else {
        setProductsList(getAllProducts());
      }

      // 2. Orders
      const orders = await fetchOrdersFromSupabase();
      setOrdersList(orders);

      // 3. Promo codes
      const promos = await fetchPromoCodesFromSupabase();
      setPromosList(promos);

      // 4. Site Settings
      const settings = await fetchSiteSettings();
      setSiteSettings(settings);


      setSupabaseConnected(true);
    } catch (err) {
      console.error('Error loading Supabase data', err);
      setSupabaseConnected(false);
    } finally {
      setIsSyncing(false);
    }
  };

  useEffect(() => {
    loadAllData();
  }, []);

  // Logout handler
  const handleLogout = async () => {
    try {
      await fetch('/api/admin/logout', { method: 'POST' });
      window.location.href = '/admin/login';
    } catch {
      window.location.href = '/admin/login';
    }
  };

  // Toggle Product Visibility
  const handleToggleVisibility = async (product: Product) => {
    const updatedVisible = !product.visible;
    const res = await saveProductToSupabase({
      ...product,
      visible: updatedVisible,
    });

    if (res.success) {
      setProductsList((prev) =>
        prev.map((p) => (p.id === product.id ? { ...p, visible: updatedVisible } : p))
      );
      showTemporaryToast(`Zmieniono widoczność: ${product.name}`);
    } else {
      alert('Błąd aktualizacji: ' + res.error);
    }
  };

  // Open Edit Modal
  const openEditModal = (product: Product) => {
    setEditingProductId(product.id);
    setName(product.name);
    setNameEn(product.nameEn || product.name);
    setPrice(product.price.toString());
    setCategory(product.category);
    setCategoryLabel(product.categoryLabel);
    setMaterial(product.material);
    setDescription(product.description);
    setStock(product.stock !== undefined ? product.stock.toString() : '10');
    setImages(product.images || []);
    setImageUrl('');
    setColors(product.colors || []);
    setIsModalOpen(true);
  };

  // Open New Product Modal
  const openNewProductModal = () => {
    setEditingProductId(null);
    setName('');
    setNameEn('');
    setPrice('79.00');
    setCategory('silk');
    setCategoryLabel('100% Jedwab Morwowy (19 Momme)');
    setMaterial('100% Jedwab Morwowy (19 Momme)');
    setDescription('');
    setStock('15');
    setImages(['/assets/durag_silk_black.png']);
    setImageUrl('');
    setColors([{ name: 'Obsidian Black', hex: '#0A0A0A' }]);
    setIsModalOpen(true);
  };

  // Save Product
  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !price) return;

    setIsSyncing(true);
    const parsedPrice = parseFloat(price);
    const parsedStock = parseInt(stock, 10) || 10;

    const payload: Partial<Product> = {
      name,
      nameEn: nameEn || name,
      price: parsedPrice,
      category,
      categoryLabel,
      material,
      description,
      stock: parsedStock,
      images: images.length > 0 ? images : ['/assets/durag_silk_black.png'],
      colors,
      visible: true,
    };

    if (editingProductId) {
      payload.id = editingProductId;
    }

    const res = await saveProductToSupabase(payload);
    setIsSyncing(false);

    if (res.success) {
      setIsModalOpen(false);
      await loadAllData();
      showTemporaryToast(editingProductId ? 'Produkt zaktualizowany' : 'Produkt dodany do sklepu');
    } else {
      alert('Błąd zapisu produktu: ' + res.error);
    }
  };

  // Delete Product
  const handleDeleteProduct = async (id: number, productName: string) => {
    if (!confirm(`Czy na pewno chcesz usunąć produkt: "${productName}"?`)) return;

    setIsSyncing(true);
    const res = await deleteProductFromSupabase(id);
    setIsSyncing(false);

    if (res.success) {
      setProductsList((prev) => prev.filter((p) => p.id !== id));
      showTemporaryToast('Produkt usunięty');
    } else {
      alert('Błąd usuwania produktu: ' + res.error);
    }
  };

  // Update Order Status
  const handleStatusChange = async (orderId: number, newStatus: SupabaseOrder['status']) => {
    setIsUpdatingOrder(orderId);
    const res = await updateOrderStatusInSupabase(orderId, newStatus);
    setIsUpdatingOrder(null);

    if (res.success) {
      setOrdersList((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
      );
      showTemporaryToast(`Zaktualizowano status zamówienia #${orderId}`);
    } else {
      alert('Błąd aktualizacji zamówienia: ' + res.error);
    }
  };

  // Add Promo Code
  const handleAddPromo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPromoCode.trim()) return;

    const rate = parseFloat(newPromoRate) / 100;
    setIsAddingPromo(true);
    const res = await savePromoCodeToSupabase(newPromoCode, rate, true);
    setIsAddingPromo(false);

    if (res.success) {
      setNewPromoCode('');
      const updated = await fetchPromoCodesFromSupabase();
      setPromosList(updated);
      showTemporaryToast('Nowy kod rabatowy został utworzony!');
    } else {
      alert('Błąd zapisu kodu: ' + res.error);
    }
  };

  // Toggle Promo Code Active
  const handleTogglePromo = async (id: number, currentStatus: boolean) => {
    const res = await togglePromoCodeStatus(id, !currentStatus);
    if (res.success) {
      setPromosList((prev) =>
        prev.map((p) => (p.id === id ? { ...p, active: !currentStatus } : p))
      );
      showTemporaryToast('Zmieniono status kodu rabatowego');
    }
  };

  // Save Site Settings (CMS Text)
  const handleSaveSiteSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingSettings(true);
    setSettingsSuccessMsg(null);

    let hasError = false;
    for (const [key, val] of Object.entries(siteSettings)) {
      const res = await saveSiteSetting(key, val);
      if (!res.success) {
        hasError = true;
        break;
      }
    }

    setIsSavingSettings(false);
    if (!hasError) {
      setSettingsSuccessMsg('Wszystkie treści strony zostały zapisane i zaktualizowane w Supabase!');
      setTimeout(() => setSettingsSuccessMsg(null), 4000);
    } else {
      alert('Błąd zapisu części ustawień.');
    }
  };


  const showTemporaryToast = (msg: string) => {
    setSyncMessage(msg);
    setTimeout(() => setSyncMessage(null), 3000);
  };

  // Filter products
  const filteredProducts = productsList.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(productSearch.toLowerCase()) ||
      (p.material && p.material.toLowerCase().includes(productSearch.toLowerCase()));
    const matchesCat = categoryFilter === 'all' || p.category === categoryFilter;
    return matchesSearch && matchesCat;
  });

  // Filter orders
  const filteredOrders = ordersList.filter((o) => {
    if (!orderSearch.trim()) return true;
    const q = orderSearch.toLowerCase();
    return (
      o.order_no.toLowerCase().includes(q) ||
      o.customer_name.toLowerCase().includes(q) ||
      o.customer_email.toLowerCase().includes(q) ||
      (o.locker_code && o.locker_code.toLowerCase().includes(q))
    );
  });

  return (
    <div className="min-h-screen bg-[#0D0D0B] text-[#EAE6DF] flex flex-col font-sans selection:bg-[#C6A87D] selection:text-black">
      
      {/* Top Bar / Brand Atelier Header */}
      <header className="border-b border-[#242421] bg-[#141412] px-6 py-4 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-4">
          <div className="w-9 h-9 rounded bg-[#0D0D0B] border border-[#3A3A36] flex items-center justify-center font-serif text-[#C6A87D] font-bold text-sm">
            WDS
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-serif text-base tracking-wide text-white font-medium">
                Warsaw Durag Store
              </h1>
              <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-[#242421] text-[#C6A87D] font-semibold border border-[#3A3A36]">
                Atelier CMS
              </span>
            </div>
            <p className="text-[11px] text-[#8C8D94]">
              Panel zarządzania sklepem i bazą danych Supabase
            </p>
          </div>
        </div>

        {/* Status Indicators & Actions */}
        <div className="flex items-center gap-3">
          {/* Live Supabase Cloud Indicator */}
          <div
            className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-mono border ${
              supabaseConnected
                ? 'bg-[#18271B] border-[#2A4D30] text-[#7CE08A]'
                : 'bg-[#2A1818] border-[#4D2A2A] text-[#FF8A8A]'
            }`}
          >
            <span
              className={`w-2 h-2 rounded-full ${
                supabaseConnected ? 'bg-[#4AE062] animate-pulse' : 'bg-[#E04A4A]'
              }`}
            />
            <span>{supabaseConnected ? 'Supabase: Połączono' : 'Supabase: Offline / Fallback'}</span>
          </div>

          <button
            onClick={loadAllData}
            disabled={isSyncing}
            className="px-3 py-1.5 bg-[#1F1F1D] hover:bg-[#2B2B28] text-xs text-[#EAE6DF] border border-[#3A3A36] rounded transition-colors flex items-center gap-1.5"
            title="Odśwież dane z bazy"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin text-[#C6A87D]' : ''}`} />
            <span className="hidden sm:inline">Odśwież</span>
          </button>

          <button
            onClick={handleLogout}
            className="px-3 py-1.5 bg-[#2B1B1B] hover:bg-[#3D2525] text-xs text-[#FF9E9E] border border-[#5A3333] rounded transition-colors flex items-center gap-1.5"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Wyloguj</span>
          </button>
        </div>
      </header>

      {/* Global Notification Toast */}
      {syncMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#161614] border border-[#C6A87D] text-white px-4 py-3 rounded shadow-2xl flex items-center gap-2.5 text-xs font-medium animate-bounce-short">
          <Check className="w-4 h-4 text-[#C6A87D]" />
          <span>{syncMessage}</span>
        </div>
      )}

      {/* Navigation Tabs */}
      <nav className="border-b border-[#242421] bg-[#11110F] px-6 flex gap-1 overflow-x-auto">
        <button
          onClick={() => setActiveTab('products')}
          className={`py-3.5 px-4 text-xs uppercase tracking-widest font-semibold flex items-center gap-2 border-b-2 transition-all whitespace-nowrap ${
            activeTab === 'products'
              ? 'border-[#C6A87D] text-[#C6A87D] bg-[#161614]'
              : 'border-transparent text-[#8C8D94] hover:text-white'
          }`}
        >
          <Package className="w-4 h-4" />
          <span>Katalog Produktów ({productsList.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('orders')}
          className={`py-3.5 px-4 text-xs uppercase tracking-widest font-semibold flex items-center gap-2 border-b-2 transition-all whitespace-nowrap ${
            activeTab === 'orders'
              ? 'border-[#C6A87D] text-[#C6A87D] bg-[#161614]'
              : 'border-transparent text-[#8C8D94] hover:text-white'
          }`}
        >
          <ShoppingBag className="w-4 h-4" />
          <span>Zamówienia ({ordersList.length})</span>
          {ordersList.filter((o) => o.status === 'new').length > 0 && (
            <span className="bg-[#C6A87D] text-black text-[10px] font-bold px-1.5 py-0.2 rounded-full">
              {ordersList.filter((o) => o.status === 'new').length} nowe
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('cms')}
          className={`py-3.5 px-4 text-xs uppercase tracking-widest font-semibold flex items-center gap-2 border-b-2 transition-all whitespace-nowrap ${
            activeTab === 'cms'
              ? 'border-[#C6A87D] text-[#C6A87D] bg-[#161614]'
              : 'border-transparent text-[#8C8D94] hover:text-white'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>Treści Strony (CMS)</span>
        </button>

        <button
          onClick={() => setActiveTab('promos')}
          className={`py-3.5 px-4 text-xs uppercase tracking-widest font-semibold flex items-center gap-2 border-b-2 transition-all whitespace-nowrap ${
            activeTab === 'promos'
              ? 'border-[#C6A87D] text-[#C6A87D] bg-[#161614]'
              : 'border-transparent text-[#8C8D94] hover:text-white'
          }`}
        >
          <Tag className="w-4 h-4" />
          <span>Kody Rabatowe ({promosList.length})</span>
        </button>

      </nav>

      {/* Main Content Area */}
      <main className="flex-grow p-6 max-w-7xl w-full mx-auto space-y-6">
        
        {/* ==================================================================== */}
        {/* TAB 1: PRODUCTS MANAGEMENT */}
        {/* ==================================================================== */}
        {activeTab === 'products' && (
          <div className="space-y-5">
            
            {/* Action & Filter Bar */}
            <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
              <div className="flex gap-2 flex-grow max-w-md">
                <div className="relative flex-grow">
                  <Search className="w-4 h-4 text-[#8C8D94] absolute left-3 top-3 pointer-events-none" />
                  <input
                    type="text"
                    placeholder="Szukaj modelu po nazwie lub materiale..."
                    value={productSearch}
                    onChange={(e) => setProductSearch(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-xs bg-[#161614] border border-[#2B2B28] rounded text-white outline-none focus:border-[#C6A87D]"
                  />
                </div>

                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="px-3 py-2 text-xs bg-[#161614] border border-[#2B2B28] rounded text-[#EAE6DF] outline-none focus:border-[#C6A87D]"
                >
                  <option value="all">Wszystkie kategorie</option>
                  <option value="silk">Jedwab Morwowy</option>
                  <option value="satin">Satyna Ice Silk</option>
                  <option value="velvet">Welur</option>
                  <option value="seasonal">Sezonowe</option>
                  <option value="accessories">Akcesoria</option>
                </select>
              </div>

              <button
                onClick={openNewProductModal}
                className="px-4 py-2 bg-[#C6A87D] hover:bg-[#D4AF37] text-[#0D0D0B] text-xs uppercase tracking-wider font-bold rounded flex items-center justify-center gap-1.5 transition-colors shrink-0 shadow-sm"
              >
                <Plus className="w-4 h-4" />
                <span>Dodaj Nowy Produkt</span>
              </button>
            </div>

            {/* Products Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredProducts.map((product) => (
                <div
                  key={product.id}
                  className={`bg-[#141412] border rounded p-4 flex flex-col justify-between transition-all group ${
                    product.visible === false
                      ? 'border-[#2B2B28] opacity-60'
                      : 'border-[#242421] hover:border-[#3E3E38]'
                  }`}
                >
                  <div className="flex gap-3.5">
                    {/* Thumbnail */}
                    <div className="relative w-20 h-20 bg-[#1C1C1A] rounded shrink-0 overflow-hidden border border-[#2B2B28]">
                      <Image
                        src={product.images[0] || '/assets/durag_silk_black.png'}
                        alt={product.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>

                    <div className="flex-grow min-w-0">
                      <div className="flex items-center justify-between gap-1">
                        <span className="text-[10px] font-mono uppercase text-[#C6A87D] bg-[#211E19] px-1.5 py-0.5 rounded border border-[#3E3424]">
                          {product.category}
                        </span>
                        <span className="text-[11px] font-mono text-[#8C8D94]">
                          ID: #{product.id}
                        </span>
                      </div>

                      <h3 className="font-serif text-sm text-white font-medium mt-1 truncate">
                        {product.name}
                      </h3>
                      <p className="text-[11px] text-[#8C8D94] truncate mt-0.5">
                        {product.material}
                      </p>

                      <div className="flex items-center justify-between mt-2">
                        <span className="text-sm font-mono font-bold text-[#EAE6DF]">
                          {product.price.toFixed(2)} PLN
                        </span>
                        <span className="text-[11px] font-mono text-[#8C8D94]">
                          Magazyn: <strong className="text-white">{product.stock ?? 10} szt.</strong>
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Actions footer */}
                  <div className="mt-4 pt-3 border-t border-[#1F1F1D] flex items-center justify-between text-xs">
                    <button
                      type="button"
                      onClick={() => handleToggleVisibility(product)}
                      className={`flex items-center gap-1 text-[11px] font-medium transition-colors ${
                        product.visible === false
                          ? 'text-[#8C8D94] hover:text-white'
                          : 'text-[#7CE08A] hover:text-[#5FC96E]'
                      }`}
                    >
                      {product.visible === false ? (
                        <>
                          <EyeOff className="w-3.5 h-3.5" />
                          <span>Ukryty w sklepie</span>
                        </>
                      ) : (
                        <>
                          <Eye className="w-3.5 h-3.5" />
                          <span>Widoczny</span>
                        </>
                      )}
                    </button>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => openEditModal(product)}
                        className="p-1.5 hover:bg-[#242421] text-[#EAE6DF] rounded transition-colors"
                        title="Edytuj produkt"
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeleteProduct(product.id, product.name)}
                        className="p-1.5 hover:bg-[#3D1F1F] text-[#FF8A8A] rounded transition-colors"
                        title="Usuń produkt"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {filteredProducts.length === 0 && (
              <div className="p-12 text-center bg-[#141412] border border-[#242421] rounded text-[#8C8D94]">
                Nie znaleziono produktów spełniających podane kryteria.
              </div>
            )}
          </div>
        )}

        {/* ==================================================================== */}
        {/* TAB 2: LIVE ORDERS MANAGEMENT */}
        {/* ==================================================================== */}
        {activeTab === 'orders' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="relative max-w-sm w-full">
                <Search className="w-4 h-4 text-[#8C8D94] absolute left-3 top-3 pointer-events-none" />
                <input
                  type="text"
                  placeholder="Szukaj po numerze, kliencie, e-mailu lub paczkomacie..."
                  value={orderSearch}
                  onChange={(e) => setOrderSearch(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs bg-[#161614] border border-[#2B2B28] rounded text-white outline-none focus:border-[#C6A87D]"
                />
              </div>

              <div className="text-xs text-[#8C8D94]">
                Łącznie zamówień: <strong className="text-white">{ordersList.length}</strong>
              </div>
            </div>

            {/* Orders Table */}
            <div className="bg-[#141412] border border-[#242421] rounded overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#191917] text-[#8C8D94] uppercase tracking-wider border-b border-[#242421]">
                    <tr>
                      <th className="p-3.5">Nr Zamówienia</th>
                      <th className="p-3.5">Klient / Kontakt</th>
                      <th className="p-3.5">Dostawa & Paczkomat</th>
                      <th className="p-3.5">Produkty</th>
                      <th className="p-3.5">Kwota</th>
                      <th className="p-3.5">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#1F1F1D]">
                    {filteredOrders.map((order) => (
                      <tr key={order.order_no} className="hover:bg-[#1A1A18] transition-colors">
                        {/* Order No & Date */}
                        <td className="p-3.5 align-top">
                          <span className="font-mono font-bold text-[#C6A87D] block">
                            {order.order_no}
                          </span>
                          <span className="text-[11px] text-[#8C8D94] block mt-0.5">
                            {order.created_at
                              ? new Date(order.created_at).toLocaleDateString('pl-PL', {
                                  day: '2-digit',
                                  month: '2-digit',
                                  year: 'numeric',
                                  hour: '2-digit',
                                  minute: '2-digit',
                                })
                              : 'Bieżące'}
                          </span>
                        </td>

                        {/* Customer details */}
                        <td className="p-3.5 align-top">
                          <span className="text-white font-medium block">
                            {order.customer_name}
                          </span>
                          <a
                            href={`mailto:${order.customer_email}`}
                            className="text-[#8C8D94] hover:text-[#C6A87D] text-[11px] block mt-0.5"
                          >
                            {order.customer_email}
                          </a>
                          <a
                            href={`tel:${order.customer_phone}`}
                            className="text-[#8C8D94] hover:text-white text-[11px] block"
                          >
                            {order.customer_phone}
                          </a>
                        </td>

                        {/* Delivery Method & InPost locker */}
                        <td className="p-3.5 align-top">
                          {order.delivery_method === 'paczkomat' ? (
                            <div>
                              <div className="flex items-center gap-1 text-[#FFD100] font-mono font-bold text-xs">
                                <span>📦 {order.locker_code || 'Paczkomat'}</span>
                              </div>
                              <span className="text-[11px] text-[#A1A1A8] block mt-0.5 leading-snug">
                                {order.locker_address || 'Paczkomat InPost 24/7'}
                              </span>
                            </div>
                          ) : (
                            <div>
                              <div className="flex items-center gap-1 text-[#C6A87D] font-bold text-xs">
                                <Truck className="w-3.5 h-3.5" />
                                <span>Kurier</span>
                              </div>
                              <span className="text-[11px] text-[#A1A1A8] block mt-0.5 leading-snug">
                                {order.locker_address || 'Adres domowy'}
                              </span>
                            </div>
                          )}
                        </td>

                        {/* Items */}
                        <td className="p-3.5 align-top max-w-xs">
                          <p className="text-[11px] text-[#EAE6DF] leading-relaxed">
                            {order.items_summary || (Array.isArray(order.items) && order.items.map((i) => `${i.quantity || 1}x ${i.name}`).join(', ')) || 'Szczegóły w bazie'}
                          </p>
                          {order.discount_code && (
                            <span className="inline-block mt-1 text-[10px] font-mono bg-[#2B2B28] text-[#7CE08A] px-1.5 py-0.2 rounded">
                              KOD: {order.discount_code} (-{order.discount_pct || 10}%)
                            </span>
                          )}
                        </td>

                        {/* Total */}
                        <td className="p-3.5 align-top font-mono font-bold text-white whitespace-nowrap">
                          {Number(order.total).toFixed(2)} PLN
                        </td>

                        {/* Status Select */}
                        <td className="p-3.5 align-top">
                          <select
                            value={order.status}
                            disabled={isUpdatingOrder === order.id}
                            onChange={(e) =>
                              order.id && handleStatusChange(order.id, e.target.value as SupabaseOrder['status'])
                            }
                            className={`px-2.5 py-1.5 text-xs rounded font-medium outline-none border cursor-pointer ${
                              order.status === 'new'
                                ? 'bg-[#2E2010] text-[#FFB74D] border-[#5E3F18]'
                                : order.status === 'processing'
                                ? 'bg-[#182030] text-[#64B5F6] border-[#2A3E5E]'
                                : order.status === 'shipped'
                                ? 'bg-[#251830] text-[#BA68C8] border-[#4A2E60]'
                                : order.status === 'delivered'
                                ? 'bg-[#142818] text-[#81C784] border-[#254D2A]'
                                : 'bg-[#2A1818] text-[#E57373] border-[#4D2525]'
                            }`}
                          >
                            <option value="new">Nowe</option>
                            <option value="processing">W realizacji</option>
                            <option value="shipped">Wysłane (InPost)</option>
                            <option value="delivered">Dostarczone</option>
                            <option value="cancelled">Anulowane</option>
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {filteredOrders.length === 0 && (
                <div className="p-12 text-center text-[#8C8D94]">
                  {ordersList.length === 0
                    ? 'Brak zamówień w bazie. Nowe zamówienia ze sklepu pojawią się tutaj automatycznie!'
                    : 'Brak zamówień pasujących do wyszukiwania.'}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ==================================================================== */}
        {/* TAB 3: SITE CONTENT CMS */}
        {/* ==================================================================== */}
        {activeTab === 'cms' && (
          <form onSubmit={handleSaveSiteSettings} className="space-y-6 max-w-3xl">
            <div className="bg-[#141412] border border-[#242421] p-6 rounded space-y-5">
              <div className="border-b border-[#242421] pb-3">
                <h3 className="font-serif text-lg text-white font-medium">
                  Zarządzanie Treściami Sklepu (CMS)
                </h3>
                <p className="text-xs text-[#8C8D94] mt-1">
                  Zmieniaj teksty nagłówków, paska ogłoszeń i sekcji na żywo bez ingerencji w kod źródłowy.
                </p>
              </div>

              {/* Announcement Bar */}
              <div className="space-y-1.5">
                <label className="text-xs uppercase tracking-wider text-[#C6A87D] font-bold block">
                  Pasek ogłoszeń (Górny banner strony)
                </label>
                <input
                  type="text"
                  value={siteSettings.announcement_bar || ''}
                  onChange={(e) =>
                    setSiteSettings({ ...siteSettings, announcement_bar: e.target.value })
                  }
                  className="w-full px-3 py-2.5 text-xs bg-[#1A1A18] border border-[#2B2B28] rounded text-white outline-none focus:border-[#C6A87D]"
                  placeholder="np. Darmowa wysyłka InPost od 150 PLN • Wysyłka w 24h z Warszawy"
                />
              </div>

              {/* Hero Section */}
              <div className="space-y-3 pt-3 border-t border-[#1F1F1D]">
                <h4 className="text-xs uppercase tracking-widest text-[#8C8D94] font-semibold">
                  Sekcja Główna (Hero)
                </h4>

                <div className="space-y-1.5">
                  <label className="text-[11px] text-[#A1A1A8] block">Odznaka / Badge:</label>
                  <input
                    type="text"
                    value={siteSettings.hero_badge || ''}
                    onChange={(e) =>
                      setSiteSettings({ ...siteSettings, hero_badge: e.target.value })
                    }
                    className="w-full px-3 py-2 text-xs bg-[#1A1A18] border border-[#2B2B28] rounded text-white outline-none focus:border-[#C6A87D]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] text-[#A1A1A8] block">Główny Tytuł (H1):</label>
                  <input
                    type="text"
                    value={siteSettings.hero_title || ''}
                    onChange={(e) =>
                      setSiteSettings({ ...siteSettings, hero_title: e.target.value })
                    }
                    className="w-full px-3 py-2 text-xs bg-[#1A1A18] border border-[#2B2B28] rounded text-white outline-none focus:border-[#C6A87D]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] text-[#A1A1A8] block">Podtytuł Hero:</label>
                  <textarea
                    rows={3}
                    value={siteSettings.hero_subtitle || ''}
                    onChange={(e) =>
                      setSiteSettings({ ...siteSettings, hero_subtitle: e.target.value })
                    }
                    className="w-full px-3 py-2 text-xs bg-[#1A1A18] border border-[#2B2B28] rounded text-white outline-none focus:border-[#C6A87D]"
                  />
                </div>
              </div>

              {/* Contact Information */}
              <div className="space-y-3 pt-3 border-t border-[#1F1F1D]">
                <h4 className="text-xs uppercase tracking-widest text-[#8C8D94] font-semibold">
                  Dane Kontaktowe
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="text-[11px] text-[#A1A1A8] block">E-mail kontaktowy:</label>
                    <input
                      type="email"
                      value={siteSettings.contact_email || ''}
                      onChange={(e) =>
                        setSiteSettings({ ...siteSettings, contact_email: e.target.value })
                      }
                      className="w-full px-3 py-2 text-xs bg-[#1A1A18] border border-[#2B2B28] rounded text-white outline-none focus:border-[#C6A87D]"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[11px] text-[#A1A1A8] block">Telefon:</label>
                    <input
                      type="text"
                      value={siteSettings.contact_phone || ''}
                      onChange={(e) =>
                        setSiteSettings({ ...siteSettings, contact_phone: e.target.value })
                      }
                      className="w-full px-3 py-2 text-xs bg-[#1A1A18] border border-[#2B2B28] rounded text-white outline-none focus:border-[#C6A87D]"
                    />
                  </div>
                </div>
              </div>

              {settingsSuccessMsg && (
                <div className="p-3 bg-[#18271B] border border-[#2A4D30] text-[#7CE08A] text-xs rounded font-medium flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{settingsSuccessMsg}</span>
                </div>
              )}

              {/* Save Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSavingSettings}
                  className="px-6 py-3 bg-[#C6A87D] hover:bg-[#D4AF37] text-black text-xs uppercase tracking-widest font-bold rounded transition-colors flex items-center gap-2 disabled:opacity-50"
                >
                  {isSavingSettings ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Zapisywanie w bazie...</span>
                    </>
                  ) : (
                    <>
                      <Check className="w-4 h-4" />
                      <span>Zapisz zmiany w treściach strony</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>
        )}

        {/* ==================================================================== */}
        {/* TAB 4: PROMO CODES */}
        {/* ==================================================================== */}
        {activeTab === 'promos' && (
          <div className="space-y-6 max-w-3xl">
            {/* Create Promo Code Form */}
            <form onSubmit={handleAddPromo} className="bg-[#141412] border border-[#242421] p-5 rounded space-y-4">
              <h3 className="font-serif text-sm text-white font-medium flex items-center gap-2">
                <Tag className="w-4 h-4 text-[#C6A87D]" />
                Dodaj Nowy Kod Rabatowy
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="text-[11px] text-[#8C8D94] block mb-1">Kod rabatowy:</label>
                  <input
                    type="text"
                    placeholder="np. LATO25"
                    required
                    value={newPromoCode}
                    onChange={(e) => setNewPromoCode(e.target.value.toUpperCase())}
                    className="w-full px-3 py-2 text-xs bg-[#1A1A18] border border-[#2B2B28] rounded text-white font-mono uppercase outline-none focus:border-[#C6A87D]"
                  />
                </div>

                <div>
                  <label className="text-[11px] text-[#8C8D94] block mb-1">Wartość rabatu (%):</label>
                  <input
                    type="number"
                    min="1"
                    max="90"
                    required
                    value={newPromoRate}
                    onChange={(e) => setNewPromoRate(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-[#1A1A18] border border-[#2B2B28] rounded text-white font-mono outline-none focus:border-[#C6A87D]"
                  />
                </div>

                <div className="flex items-end">
                  <button
                    type="submit"
                    disabled={isAddingPromo}
                    className="w-full py-2 bg-[#C6A87D] hover:bg-[#D4AF37] text-black text-xs uppercase tracking-wider font-bold rounded transition-colors"
                  >
                    {isAddingPromo ? 'Zapisywanie...' : 'Utwórz Kod'}
                  </button>
                </div>
              </div>
            </form>

            {/* Existing Promo Codes List */}
            <div className="bg-[#141412] border border-[#242421] rounded overflow-hidden">
              <div className="p-4 border-b border-[#242421]">
                <h4 className="font-serif text-sm text-white font-medium">
                  Aktywne i Zdefiniowane Kody
                </h4>
              </div>

              <div className="divide-y divide-[#1F1F1D]">
                {promosList.map((promo) => (
                  <div key={promo.id} className="p-4 flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-sm font-bold text-white bg-[#1F1F1D] px-2 py-0.5 rounded border border-[#3A3A36]">
                          {promo.code}
                        </span>
                        <span className="text-xs font-mono font-semibold text-[#7CE08A]">
                          -{(Number(promo.rate) * 100).toFixed(0)}%
                        </span>
                      </div>
                      <span className="text-[11px] text-[#8C8D94] mt-1 block">
                        Użyto: {promo.uses_count || 0} razy
                      </span>
                    </div>

                    <button
                      onClick={() => handleTogglePromo(promo.id, promo.active)}
                      className={`px-3 py-1.5 rounded text-xs font-medium border transition-colors ${
                        promo.active
                          ? 'bg-[#18271B] border-[#2A4D30] text-[#7CE08A] hover:bg-[#203624]'
                          : 'bg-[#2A1818] border-[#4D2A2A] text-[#FF8A8A] hover:bg-[#382020]'
                      }`}
                    >
                      {promo.active ? 'Aktywny' : 'Wyłączony'}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}


      </main>

      {/* ==================================================================== */}
      {/* PRODUCT EDIT / ADD MODAL */}
      {/* ==================================================================== */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[#141412] border border-[#3A3A36] rounded w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl my-8">
            <div className="p-5 border-b border-[#242421] flex items-center justify-between sticky top-0 bg-[#141412] z-10">
              <h3 className="font-serif text-base text-white font-medium">
                {editingProductId ? `Edycja Produktu #${editingProductId}` : 'Nowy Produkt w Katalogu'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 text-[#8C8D94] hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="p-6 space-y-4 text-xs">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[#8C8D94] block mb-1">Nazwa produktu (PL) *</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3 py-2 bg-[#1C1C1A] border border-[#2B2B28] rounded text-white outline-none focus:border-[#C6A87D]"
                  />
                </div>

                <div>
                  <label className="text-[#8C8D94] block mb-1">Nazwa produktu (EN)</label>
                  <input
                    type="text"
                    value={nameEn}
                    onChange={(e) => setNameEn(e.target.value)}
                    className="w-full px-3 py-2 bg-[#1C1C1A] border border-[#2B2B28] rounded text-white outline-none focus:border-[#C6A87D]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="text-[#8C8D94] block mb-1">Cena (PLN) *</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="w-full px-3 py-2 bg-[#1C1C1A] border border-[#2B2B28] rounded text-white font-mono outline-none focus:border-[#C6A87D]"
                  />
                </div>

                <div>
                  <label className="text-[#8C8D94] block mb-1">Kategoria</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="w-full px-3 py-2 bg-[#1C1C1A] border border-[#2B2B28] rounded text-white outline-none focus:border-[#C6A87D]"
                  >
                    <option value="silk">Jedwab Morwowy (silk)</option>
                    <option value="satin">Satyna (satin)</option>
                    <option value="velvet">Welur (velvet)</option>
                    <option value="seasonal">Sezonowe (seasonal)</option>
                    <option value="accessories">Akcesoria (accessories)</option>
                  </select>
                </div>

                <div>
                  <label className="text-[#8C8D94] block mb-1">Stan magazynowy (szt.)</label>
                  <input
                    type="number"
                    min="0"
                    value={stock}
                    onChange={(e) => setStock(e.target.value)}
                    className="w-full px-3 py-2 bg-[#1C1C1A] border border-[#2B2B28] rounded text-white font-mono outline-none focus:border-[#C6A87D]"
                  />
                </div>
              </div>

              <div>
                <label className="text-[#8C8D94] block mb-1">Materiał (opis specyfikacji)</label>
                <input
                  type="text"
                  value={material}
                  onChange={(e) => setMaterial(e.target.value)}
                  className="w-full px-3 py-2 bg-[#1C1C1A] border border-[#2B2B28] rounded text-white outline-none focus:border-[#C6A87D]"
                />
              </div>

              <div>
                <label className="text-[#8C8D94] block mb-1">Opis produktu</label>
                <textarea
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3 py-2 bg-[#1C1C1A] border border-[#2B2B28] rounded text-white outline-none focus:border-[#C6A87D]"
                />
              </div>

              {/* Images Gallery Manager */}
              <div className="space-y-2 pt-2 border-t border-[#242421]">
                <label className="text-[#8C8D94] block font-semibold">Galeria Zdjęć</label>
                
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Wklej ścieżkę lub URL zdjęcia (np. /assets/... lub https://...)"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    className="flex-grow px-3 py-2 bg-[#1C1C1A] border border-[#2B2B28] rounded text-white outline-none focus:border-[#C6A87D]"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (imageUrl.trim()) {
                        setImages([...images, imageUrl.trim()]);
                        setImageUrl('');
                      }
                    }}
                    className="px-3 py-2 bg-[#1F1F1D] hover:bg-[#2B2B28] text-white border border-[#3A3A36] rounded"
                  >
                    Dodaj
                  </button>
                </div>

                <div className="flex flex-wrap gap-2 pt-1">
                  {images.map((img, idx) => (
                    <div
                      key={idx}
                      className="relative w-16 h-16 bg-[#1C1C1A] rounded border border-[#2B2B28] overflow-hidden group"
                    >
                      <Image src={img} alt="" fill className="object-cover" />
                      <button
                        type="button"
                        onClick={() => setImages(images.filter((_, i) => i !== idx))}
                        className="absolute inset-0 bg-black/70 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                        title="Usuń zdjęcie"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="pt-4 border-t border-[#242421] flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-[#1F1F1D] text-[#8C8D94] hover:text-white rounded transition-colors"
                >
                  Anuluj
                </button>
                <button
                  type="submit"
                  disabled={isSyncing}
                  className="px-5 py-2 bg-[#C6A87D] hover:bg-[#D4AF37] text-black font-bold uppercase tracking-wider rounded transition-colors shadow-sm"
                >
                  {isSyncing ? 'Zapisywanie w bazie...' : 'Zapisz Produkt'}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}
