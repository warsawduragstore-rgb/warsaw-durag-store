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
  Copy,
  Phone,
  Mail,
  MapPin,
  TrendingUp,
  CreditCard,
  ChevronRight,
  Info,
  Calendar,
  DollarSign,
  Layers,
  Globe,
  HelpCircle,
  MessageSquare,
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
  updateOrderDetailsInSupabase,
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

  // Orders State & Logs
  const [ordersList, setOrdersList] = useState<SupabaseOrder[]>([]);
  const [orderSearch, setOrderSearch] = useState('');
  const [orderStatusFilter, setOrderStatusFilter] = useState<string>('all');
  const [orderPaymentFilter, setOrderPaymentFilter] = useState<string>('all');
  const [isUpdatingOrder, setIsUpdatingOrder] = useState<number | null>(null);

  // Selected Order Modal (Full Purchase Log)
  const [selectedOrderForModal, setSelectedOrderForModal] = useState<SupabaseOrder | null>(null);
  const [trackingNumberInput, setTrackingNumberInput] = useState('');
  const [isSavingTracking, setIsSavingTracking] = useState(false);
  const [copiedLogJson, setCopiedLogJson] = useState(false);

  // Promo Codes State
  const [promosList, setPromosList] = useState<SupabasePromoCode[]>([]);
  const [newPromoCode, setNewPromoCode] = useState('');
  const [newPromoRate, setNewPromoRate] = useState('10');
  const [isAddingPromo, setIsAddingPromo] = useState(false);

  // Site Settings CMS State (Full site editor)
  const [siteSettings, setSiteSettings] = useState<Record<string, string>>(DEFAULT_SITE_SETTINGS);
  const [cmsSubTab, setCmsSubTab] = useState<'hero' | 'promo' | 'catalog' | 'about' | 'trust' | 'faq' | 'contact'>('hero');
  const [faqList, setFaqList] = useState<Array<{ q_pl: string; q_en: string; a_pl: string; a_en: string }>>([]);
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
      let prodData: any[] | null = null;
      try {
        const adminRes = await fetch('/api/admin/products');
        if (adminRes.ok) {
          const json = await adminRes.json();
          if (json.success && Array.isArray(json.data) && json.data.length > 0) {
            prodData = json.data;
          }
        }
      } catch {
        // fallback to client below
      }

      if (!prodData) {
        const { data } = await client
          .from('products')
          .select('*')
          .order('id', { ascending: true });
        prodData = data;
      }

      if (prodData && prodData.length > 0) {
        setProductsList(prodData.map(mapSupabaseRowToProduct));
        setSupabaseConnected(true);
      } else {
        setProductsList(getAllProducts());
      }

      // 2. Orders (Full logs)
      const orders = await fetchOrdersFromSupabase();
      setOrdersList(orders);

      // 3. Promo codes
      const promos = await fetchPromoCodesFromSupabase();
      setPromosList(promos);

      // 4. Site Settings
      const settings = await fetchSiteSettings();
      setSiteSettings(settings);
      if (settings.faq_items) {
        try {
          const parsed = JSON.parse(settings.faq_items);
          if (Array.isArray(parsed)) {
            setFaqList(parsed);
          }
        } catch {
          // ignore
        }
      }

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
      if (selectedOrderForModal?.id === orderId) {
        setSelectedOrderForModal((prev) => prev ? { ...prev, status: newStatus } : null);
      }
      showTemporaryToast(`Zaktualizowano status zamówienia #${orderId}`);
    } else {
      alert('Błąd aktualizacji zamówienia: ' + res.error);
    }
  };

  // Open Order Modal (Full Purchase Log)
  const openOrderModal = (order: SupabaseOrder) => {
    setSelectedOrderForModal(order);
    setTrackingNumberInput(order.tracking_number || '');
    setCopiedLogJson(false);
  };

  // Save InPost Tracking Number
  const handleSaveTrackingNumber = async () => {
    if (!selectedOrderForModal?.id) return;
    setIsSavingTracking(true);
    const newTracking = trackingNumberInput.trim() || null;
    const shouldShip = Boolean(newTracking) && selectedOrderForModal.status !== 'delivered';
    const newStatus = shouldShip ? 'shipped' : selectedOrderForModal.status;

    const res = await updateOrderDetailsInSupabase(selectedOrderForModal.id, {
      tracking_number: newTracking,
      status: newStatus,
    });
    setIsSavingTracking(false);

    if (res.success) {
      const updatedOrder: SupabaseOrder = {
        ...selectedOrderForModal,
        tracking_number: newTracking,
        status: newStatus,
      };
      setSelectedOrderForModal(updatedOrder);
      setOrdersList((prev) =>
        prev.map((o) => (o.id === selectedOrderForModal.id ? updatedOrder : o))
      );
      showTemporaryToast('Zapisano numer przesyłki InPost!');
    } else {
      alert('Błąd zapisu numeru przesyłki: ' + res.error);
    }
  };

  // Change Payment Status in Modal
  const handleModalPaymentStatusChange = async (newPaymentStatus: SupabaseOrder['payment_status']) => {
    if (!selectedOrderForModal?.id) return;
    const res = await updateOrderDetailsInSupabase(selectedOrderForModal.id, {
      payment_status: newPaymentStatus,
    });
    if (res.success) {
      const updatedOrder: SupabaseOrder = {
        ...selectedOrderForModal,
        payment_status: newPaymentStatus,
      };
      setSelectedOrderForModal(updatedOrder);
      setOrdersList((prev) =>
        prev.map((o) => (o.id === selectedOrderForModal.id ? updatedOrder : o))
      );
      showTemporaryToast(`Zmieniono status płatności na: ${newPaymentStatus}`);
    } else {
      alert('Błąd aktualizacji płatności');
    }
  };

  // Change Order Status in Modal
  const handleModalOrderStatusChange = async (newStatus: SupabaseOrder['status']) => {
    if (!selectedOrderForModal?.id) return;
    await handleStatusChange(selectedOrderForModal.id, newStatus);
  };

  // Copy Raw JSON Log to clipboard
  const copyOrderLogJson = () => {
    if (!selectedOrderForModal) return;
    navigator.clipboard.writeText(JSON.stringify(selectedOrderForModal, null, 2));
    setCopiedLogJson(true);
    setTimeout(() => setCopiedLogJson(false), 2500);
  };

  // Export orders to CSV
  const exportOrdersToCSV = () => {
    if (ordersList.length === 0) {
      alert('Brak zamówień do wyeksportowania.');
      return;
    }
    const headers = [
      'Nr zamówienia',
      'Data złożenia',
      'Klient',
      'Email',
      'Telefon',
      'Metoda dostawy',
      'Paczkomat InPost',
      'Adres dostawy',
      'Zamówione pozycje',
      'Wartość (PLN)',
      'Kod rabatowy',
      'Wartość rabatu (PLN)',
      'Status zamówienia',
      'Status płatności',
      'Numer listu przewozowego',
      'Stripe Session ID',
    ];

    const rows = ordersList.map((o) => [
      `"${o.order_no}"`,
      `"${o.created_at ? new Date(o.created_at).toLocaleString('pl-PL') : ''}"`,
      `"${(o.customer_name || '').replace(/"/g, '""')}"`,
      `"${o.customer_email || ''}"`,
      `"${o.customer_phone || ''}"`,
      `"${o.delivery_method || ''}"`,
      `"${o.locker_code || ''}"`,
      `"${(o.locker_address || '').replace(/"/g, '""')}"`,
      `"${(o.items_summary || (Array.isArray(o.items) ? o.items.map((i: any) => `${i.quantity || 1}x ${i.name}`).join(' | ') : '')).replace(/"/g, '""')}"`,
      `"${Number(o.total).toFixed(2)}"`,
      `"${o.discount_code || ''}"`,
      `"${Number(o.discount_val || 0).toFixed(2)}"`,
      `"${o.status}"`,
      `"${o.payment_status || 'pending'}"`,
      `"${o.tracking_number || ''}"`,
      `"${o.stripe_session_id || ''}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headers.join(';'), ...rows.map((r) => r.join(';'))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `zamowienia-warsawduragstore-${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Export full raw logs to JSON
  const exportOrdersToJSON = () => {
    if (ordersList.length === 0) {
      alert('Brak zamówień do wyeksportowania.');
      return;
    }
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(ordersList, null, 2));
    const link = document.createElement('a');
    link.setAttribute('href', dataStr);
    link.setAttribute('download', `pelne-logi-zamowien-${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // FAQ interactive editor handlers
  const updateFaqItem = (index: number, field: string, val: string) => {
    const updated = [...faqList];
    updated[index] = { ...updated[index], [field]: val };
    setFaqList(updated);
    setSiteSettings((prev) => ({ ...prev, faq_items: JSON.stringify(updated) }));
  };

  const addFaqItem = () => {
    const updated = [
      ...faqList,
      {
        q_pl: 'Nowe pytanie...',
        q_en: 'New question...',
        a_pl: 'Treść odpowiedzi...',
        a_en: 'Answer content...',
      },
    ];
    setFaqList(updated);
    setSiteSettings((prev) => ({ ...prev, faq_items: JSON.stringify(updated) }));
  };

  const removeFaqItem = (index: number) => {
    const updated = faqList.filter((_, i) => i !== index);
    setFaqList(updated);
    setSiteSettings((prev) => ({ ...prev, faq_items: JSON.stringify(updated) }));
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
      try {
        localStorage.setItem('wds_site_settings', JSON.stringify(siteSettings));
        window.dispatchEvent(new Event('wds_settings_updated'));
      } catch {
        // ignore
      }
      setSettingsSuccessMsg('Wszystkie treści strony zostały zapisane i zaktualizowane na żywo!');
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

  // Filter orders with rich search and status filters
  const filteredOrders = ordersList.filter((o) => {
    const q = orderSearch.trim().toLowerCase();
    const matchesSearch = !q || (
      (o.order_no && o.order_no.toLowerCase().includes(q)) ||
      (o.customer_name && o.customer_name.toLowerCase().includes(q)) ||
      (o.customer_email && o.customer_email.toLowerCase().includes(q)) ||
      (o.customer_phone && o.customer_phone.toLowerCase().includes(q)) ||
      (o.locker_code && o.locker_code.toLowerCase().includes(q)) ||
      (o.tracking_number && o.tracking_number.toLowerCase().includes(q)) ||
      (o.stripe_session_id && o.stripe_session_id.toLowerCase().includes(q))
    );

    const matchesStatus = orderStatusFilter === 'all' || o.status === orderStatusFilter;
    const matchesPayment = orderPaymentFilter === 'all' || (o.payment_status || 'pending') === orderPaymentFilter;

    return matchesSearch && matchesStatus && matchesPayment;
  });

  // Revenue and KPI calculations
  const totalRevenue = ordersList
    .filter((o) => o.payment_status === 'paid' || o.status === 'delivered' || o.status === 'shipped')
    .reduce((sum, o) => sum + (Number(o.total) || 0), 0);
  const paidOrdersCount = ordersList.filter((o) => o.payment_status === 'paid').length;
  const pendingOrdersCount = ordersList.filter((o) => o.payment_status === 'pending' || o.status === 'pending_payment').length;
  const paczkomatOrdersCount = ordersList.filter((o) => o.delivery_method === 'paczkomat').length;
  const courierOrdersCount = ordersList.filter((o) => o.delivery_method === 'courier').length;

  return (
    <div className="admin-view min-h-screen bg-[#FAF9F6] text-[#141416] flex flex-col font-sans selection:bg-[#B85C2E] selection:text-white">
      
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
        {/* TAB 2: LIVE ORDERS MANAGEMENT & PURCHASE LOGS */}
        {/* ==================================================================== */}
        {activeTab === 'orders' && (
          <div className="space-y-6">
            
            {/* KPI Metric Overview Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Card 1: Revenue */}
              <div className="bg-[#141412] border border-[#242421] p-4 rounded">
                <div className="flex items-center justify-between text-[#8C8D94] text-xs">
                  <span>Przychód ze sprzedaży</span>
                  <DollarSign className="w-4 h-4 text-[#C6A87D]" />
                </div>
                <div className="text-xl sm:text-2xl font-mono font-bold text-white mt-2">
                  {totalRevenue.toFixed(2)} PLN
                </div>
                <div className="text-[11px] text-[#7CE08A] mt-1 flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" />
                  <span>Opłacone i zrealizowane zamówienia</span>
                </div>
              </div>

              {/* Card 2: Total Orders */}
              <div className="bg-[#141412] border border-[#242421] p-4 rounded">
                <div className="flex items-center justify-between text-[#8C8D94] text-xs">
                  <span>Wszystkie zamówienia</span>
                  <ShoppingBag className="w-4 h-4 text-[#C6A87D]" />
                </div>
                <div className="text-xl sm:text-2xl font-mono font-bold text-white mt-2">
                  {ordersList.length}
                </div>
                <div className="text-[11px] text-[#8C8D94] mt-1">
                  Nowe do spakowania: <strong className="text-[#FFB74D]">{ordersList.filter((o) => o.status === 'new').length}</strong>
                </div>
              </div>

              {/* Card 3: Payment Status Breakdown */}
              <div className="bg-[#141412] border border-[#242421] p-4 rounded">
                <div className="flex items-center justify-between text-[#8C8D94] text-xs">
                  <span>Płatności Stripe</span>
                  <CreditCard className="w-4 h-4 text-[#C6A87D]" />
                </div>
                <div className="flex items-baseline gap-2 mt-2 font-mono">
                  <span className="text-lg font-bold text-[#7CE08A]">{paidOrdersCount} opłacone</span>
                  <span className="text-xs text-[#8C8D94]">/</span>
                  <span className="text-sm text-[#FFB74D]">{pendingOrdersCount} oczekuje</span>
                </div>
                <div className="text-[11px] text-[#8C8D94] mt-1">
                  BLIK, P24, Karty płatnicze
                </div>
              </div>

              {/* Card 4: InPost & Delivery Breakdown */}
              <div className="bg-[#141412] border border-[#242421] p-4 rounded">
                <div className="flex items-center justify-between text-[#8C8D94] text-xs">
                  <span>Metody dostawy</span>
                  <Truck className="w-4 h-4 text-[#C6A87D]" />
                </div>
                <div className="flex items-baseline gap-2 mt-2 font-mono">
                  <span className="text-lg font-bold text-[#FFD100]">📦 {paczkomatOrdersCount} Paczkomat</span>
                  <span className="text-xs text-[#8C8D94]">/</span>
                  <span className="text-sm text-[#C6A87D]">{courierOrdersCount} Kurier</span>
                </div>
                <div className="text-[11px] text-[#8C8D94] mt-1">
                  100% integracji z siecią InPost 24/7
                </div>
              </div>
            </div>

            {/* Filter, Search & Export Bar */}
            <div className="bg-[#141412] border border-[#242421] p-4 rounded flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
              <div className="flex flex-col sm:flex-row gap-2 flex-grow max-w-2xl">
                {/* Search query */}
                <div className="relative flex-grow">
                  <Search className="w-4 h-4 text-[#8C8D94] absolute left-3 top-2.5 pointer-events-none" />
                  <input
                    type="text"
                    placeholder="Szukaj po nr zamówienia, kliencie, emailu, paczkomacie, nr przesyłki..."
                    value={orderSearch}
                    onChange={(e) => setOrderSearch(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-xs bg-[#1A1A18] border border-[#2B2B28] rounded text-white outline-none focus:border-[#C6A87D]"
                  />
                  {orderSearch && (
                    <button
                      onClick={() => setOrderSearch('')}
                      className="absolute right-2.5 top-2.5 text-[#8C8D94] hover:text-white"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                {/* Status Filter */}
                <select
                  value={orderStatusFilter}
                  onChange={(e) => setOrderStatusFilter(e.target.value)}
                  className="px-3 py-2 text-xs bg-[#1A1A18] border border-[#2B2B28] rounded text-[#EAE6DF] outline-none focus:border-[#C6A87D]"
                >
                  <option value="all">Wszystkie statusy zamówień</option>
                  <option value="new">Nowe (do spakowania)</option>
                  <option value="processing">W realizacji</option>
                  <option value="shipped">Wysłane (InPost)</option>
                  <option value="delivered">Dostarczone</option>
                  <option value="pending_payment">Oczekuje na płatność</option>
                  <option value="cancelled">Anulowane</option>
                </select>

                {/* Payment Filter */}
                <select
                  value={orderPaymentFilter}
                  onChange={(e) => setOrderPaymentFilter(e.target.value)}
                  className="px-3 py-2 text-xs bg-[#1A1A18] border border-[#2B2B28] rounded text-[#EAE6DF] outline-none focus:border-[#C6A87D]"
                >
                  <option value="all">Wszystkie płatności</option>
                  <option value="paid">Opłacone (Stripe Paid)</option>
                  <option value="pending">Oczekujące (Pending)</option>
                  <option value="failed">Nieudane (Failed)</option>
                  <option value="refunded">Zwrócone (Refunded)</option>
                </select>
              </div>

              {/* Export Buttons */}
              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={exportOrdersToCSV}
                  title="Eksportuj wszystkie zamówienia do pliku arkusza CSV"
                  className="px-3 py-2 bg-[#1F1F1D] hover:bg-[#2B2B28] text-[#EAE6DF] border border-[#3A3A36] text-xs font-medium rounded transition-colors flex items-center gap-1.5"
                >
                  <Download className="w-3.5 h-3.5 text-[#C6A87D]" />
                  <span>Eksportuj CSV</span>
                </button>
                <button
                  type="button"
                  onClick={exportOrdersToJSON}
                  title="Pobierz pełne surowe logi zamówień w formacie JSON"
                  className="px-3 py-2 bg-[#1F1F1D] hover:bg-[#2B2B28] text-[#EAE6DF] border border-[#3A3A36] text-xs font-medium rounded transition-colors flex items-center gap-1.5"
                >
                  <FileText className="w-3.5 h-3.5 text-[#7CE08A]" />
                  <span>Logi JSON</span>
                </button>
              </div>
            </div>

            {/* Orders Table */}
            <div className="bg-[#141412] border border-[#242421] rounded overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#191917] text-[#8C8D94] uppercase tracking-wider border-b border-[#242421]">
                    <tr>
                      <th className="p-3.5">Nr Zamówienia & Data</th>
                      <th className="p-3.5">Klient / Kontakt</th>
                      <th className="p-3.5">Dostawa & Punkt</th>
                      <th className="p-3.5">Produkty</th>
                      <th className="p-3.5">Kwota & Płatność</th>
                      <th className="p-3.5">Status realizacji</th>
                      <th className="p-3.5 text-right">Akcja</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#1F1F1D]">
                    {filteredOrders.map((order) => (
                      <tr key={order.order_no} className="hover:bg-[#1A1A18] transition-colors">
                        
                        {/* Order No & Timestamp */}
                        <td className="p-3.5 align-top">
                          <button
                            onClick={() => openOrderModal(order)}
                            className="font-mono font-bold text-[#C6A87D] hover:underline block text-left"
                            title="Otwórz pełny log zamówienia"
                          >
                            {order.order_no}
                          </button>
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
                        <td className="p-3.5 align-top max-w-[200px]">
                          {order.delivery_method === 'paczkomat' ? (
                            <div>
                              <div className="flex items-center gap-1.5 text-[#FFD100] font-mono font-bold text-xs">
                                <span>📦 {order.locker_code || 'Paczkomat'}</span>
                              </div>
                              <span className="text-[11px] text-[#A1A1A8] block mt-0.5 line-clamp-2 leading-snug">
                                {order.locker_address || 'Paczkomat InPost 24/7'}
                              </span>
                              {order.tracking_number && (
                                <a
                                  href={`https://inpost.pl/sledzenie-przesylek?number=${order.tracking_number}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-1 text-[10px] text-[#7CE08A] hover:underline font-mono mt-1"
                                >
                                  <span>List: {order.tracking_number}</span>
                                  <ExternalLink className="w-2.5 h-2.5" />
                                </a>
                              )}
                            </div>
                          ) : (
                            <div>
                              <div className="flex items-center gap-1 text-[#C6A87D] font-bold text-xs">
                                <Truck className="w-3.5 h-3.5" />
                                <span>{order.delivery_method === 'pickup' ? 'Odbiór osobisty' : 'Kurier'}</span>
                              </div>
                              <span className="text-[11px] text-[#A1A1A8] block mt-0.5 line-clamp-2 leading-snug">
                                {order.locker_address || (order.delivery_method === 'pickup' ? 'Włodarzewska 4, Warszawa' : 'Adres klienta')}
                              </span>
                              {order.tracking_number && (
                                <span className="text-[10px] text-[#7CE08A] font-mono block mt-1">
                                  List: {order.tracking_number}
                                </span>
                              )}
                            </div>
                          )}
                        </td>

                        {/* Items summary */}
                        <td className="p-3.5 align-top max-w-xs">
                          <p className="text-[11px] text-[#EAE6DF] leading-relaxed line-clamp-2">
                            {order.items_summary || (Array.isArray(order.items) && order.items.map((i: any) => `${i.quantity || 1}x ${i.name}`).join(', ')) || 'Szczegóły w logu'}
                          </p>
                          {order.discount_code && (
                            <span className="inline-block mt-1 text-[10px] font-mono bg-[#2B2B28] text-[#7CE08A] px-1.5 py-0.5 rounded">
                              KOD: {order.discount_code} (-{Number(order.discount_val || 0).toFixed(0)} PLN)
                            </span>
                          )}
                        </td>

                        {/* Total & Payment status */}
                        <td className="p-3.5 align-top whitespace-nowrap">
                          <div className="font-mono font-bold text-white text-sm">
                            {Number(order.total).toFixed(2)} PLN
                          </div>
                          <div className="mt-1">
                            {order.payment_status === 'paid' ? (
                              <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-semibold bg-[#18271B] border border-[#2A4D30] text-[#7CE08A]">
                                <Check className="w-2.5 h-2.5" /> Opłacone
                              </span>
                            ) : order.payment_status === 'failed' ? (
                              <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-semibold bg-[#2A1818] border border-[#4D2A2A] text-[#FF8A8A]">
                                <AlertCircle className="w-2.5 h-2.5" /> Błąd płatności
                              </span>
                            ) : order.payment_status === 'refunded' ? (
                              <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-semibold bg-[#2A1828] border border-[#4D2A4A] text-[#E08AE0]">
                                Zwrócone
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-semibold bg-[#2E2010] border border-[#5E3F18] text-[#FFB74D]">
                                Oczekuje
                              </span>
                            )}
                          </div>
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
                                : order.status === 'pending_payment'
                                ? 'bg-[#2A2418] text-[#FFD54F] border-[#5E4D18]'
                                : 'bg-[#2A1818] text-[#E57373] border-[#4D2525]'
                            }`}
                          >
                            <option value="new">Nowe (do spakowania)</option>
                            <option value="processing">W realizacji</option>
                            <option value="shipped">Wysłane (InPost)</option>
                            <option value="delivered">Dostarczone</option>
                            <option value="pending_payment">Oczekuje na płatność</option>
                            <option value="cancelled">Anulowane</option>
                          </select>
                        </td>

                        {/* Open Full Log Button */}
                        <td className="p-3.5 align-top text-right">
                          <button
                            type="button"
                            onClick={() => openOrderModal(order)}
                            className="px-2.5 py-1.5 bg-[#1F1F1D] hover:bg-[#2B2B28] text-[#C6A87D] hover:text-white border border-[#3A3A36] rounded text-xs font-medium transition-colors inline-flex items-center gap-1.5"
                            title="Zobacz pełny log zakupu i szczegóły zamówienia"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span>Pełny Log</span>
                          </button>
                        </td>

                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {filteredOrders.length === 0 && (
                <div className="p-12 text-center text-[#8C8D94] space-y-2">
                  <p>
                    {ordersList.length === 0
                      ? 'Brak zamówień w bazie danych. Nowe zamówienia ze sklepu pojawią się tutaj natychmiast.'
                      : 'Brak zamówień spełniających wybrane filtry wyszukiwania.'}
                  </p>
                  {(orderSearch || orderStatusFilter !== 'all' || orderPaymentFilter !== 'all') && (
                    <button
                      type="button"
                      onClick={() => {
                        setOrderSearch('');
                        setOrderStatusFilter('all');
                        setOrderPaymentFilter('all');
                      }}
                      className="text-xs text-[#C6A87D] hover:underline"
                    >
                      Zresetuj wszystkie filtry
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ==================================================================== */}
        {/* TAB 3: COMPLETE SITE CONTENT CMS (FULL SITE EDITOR) */}
        {/* ==================================================================== */}
        {activeTab === 'cms' && (
          <form onSubmit={handleSaveSiteSettings} className="space-y-6 max-w-4xl">
            <div className="bg-[#141412] border border-[#242421] p-6 rounded space-y-6">
              
              {/* Header */}
              <div className="border-b border-[#242421] pb-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div>
                  <h3 className="font-serif text-lg text-white font-medium flex items-center gap-2">
                    <Sliders className="w-5 h-5 text-[#C6A87D]" />
                    Edytor Całej Strony (Atelier CMS)
                  </h3>
                  <p className="text-xs text-[#8C8D94] mt-1">
                    Zmieniaj wszystkie teksty, nagłówki, odznaki, banery, FAQ i dane kontaktowe na żywo w języku polskim i angielskim.
                  </p>
                </div>

                {/* Save button in header */}
                <button
                  type="submit"
                  disabled={isSavingSettings}
                  className="px-5 py-2.5 bg-[#C6A87D] hover:bg-[#D4AF37] text-black text-xs uppercase tracking-widest font-bold rounded transition-colors flex items-center gap-2 shrink-0 disabled:opacity-50"
                >
                  {isSavingSettings ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Zapisywanie...</span>
                    </>
                  ) : (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>Zapisz Zmiany</span>
                    </>
                  )}
                </button>
              </div>

              {/* Sub-Navigation for CMS sections */}
              <div className="flex flex-wrap gap-1.5 p-1 bg-[#1A1A18] border border-[#2B2B28] rounded">
                <button
                  type="button"
                  onClick={() => setCmsSubTab('hero')}
                  className={`px-3 py-1.5 text-xs font-medium rounded transition-colors ${
                    cmsSubTab === 'hero' ? 'bg-[#C6A87D] text-black font-semibold' : 'text-[#8C8D94] hover:text-white'
                  }`}
                >
                  Hero & Pasek Ogłoszeń
                </button>
                <button
                  type="button"
                  onClick={() => setCmsSubTab('promo')}
                  className={`px-3 py-1.5 text-xs font-medium rounded transition-colors ${
                    cmsSubTab === 'promo' ? 'bg-[#C6A87D] text-black font-semibold' : 'text-[#8C8D94] hover:text-white'
                  }`}
                >
                  Promocja 2+1
                </button>
                <button
                  type="button"
                  onClick={() => setCmsSubTab('catalog')}
                  className={`px-3 py-1.5 text-xs font-medium rounded transition-colors ${
                    cmsSubTab === 'catalog' ? 'bg-[#C6A87D] text-black font-semibold' : 'text-[#8C8D94] hover:text-white'
                  }`}
                >
                  Tkaniny & Kolekcja
                </button>
                <button
                  type="button"
                  onClick={() => setCmsSubTab('about')}
                  className={`px-3 py-1.5 text-xs font-medium rounded transition-colors ${
                    cmsSubTab === 'about' ? 'bg-[#C6A87D] text-black font-semibold' : 'text-[#8C8D94] hover:text-white'
                  }`}
                >
                  O nas & Założyciele
                </button>
                <button
                  type="button"
                  onClick={() => setCmsSubTab('trust')}
                  className={`px-3 py-1.5 text-xs font-medium rounded transition-colors ${
                    cmsSubTab === 'trust' ? 'bg-[#C6A87D] text-black font-semibold' : 'text-[#8C8D94] hover:text-white'
                  }`}
                >
                  Pasek Zaufania (4 Korzyści)
                </button>
                <button
                  type="button"
                  onClick={() => setCmsSubTab('faq')}
                  className={`px-3 py-1.5 text-xs font-medium rounded transition-colors ${
                    cmsSubTab === 'faq' ? 'bg-[#C6A87D] text-black font-semibold' : 'text-[#8C8D94] hover:text-white'
                  }`}
                >
                  Pytania i Odpowiedzi (FAQ)
                </button>
                <button
                  type="button"
                  onClick={() => setCmsSubTab('contact')}
                  className={`px-3 py-1.5 text-xs font-medium rounded transition-colors ${
                    cmsSubTab === 'contact' ? 'bg-[#C6A87D] text-black font-semibold' : 'text-[#8C8D94] hover:text-white'
                  }`}
                >
                  Kontakt & Dane
                </button>
              </div>

              {/* Success message banner */}
              {settingsSuccessMsg && (
                <div className="p-3 bg-[#18271B] border border-[#2A4D30] text-[#7CE08A] text-xs rounded font-medium flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{settingsSuccessMsg}</span>
                </div>
              )}

              {/* ------------------------------------------------------------------ */}
              {/* SUB-SECTION 1: HERO & ANNOUNCEMENT BAR */}
              {/* ------------------------------------------------------------------ */}
              {cmsSubTab === 'hero' && (
                <div className="space-y-5">
                  <div className="bg-[#181816] p-4 rounded border border-[#262624] space-y-4">
                    <h4 className="text-xs uppercase tracking-wider text-[#C6A87D] font-bold">
                      Górny Pasek Ogłoszeń (Announcement Bar)
                    </h4>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div>
                        <label className="text-[11px] text-[#A1A1A8] block mb-1">Tekst paska (PL):</label>
                        <input
                          type="text"
                          value={siteSettings.announcement_bar || ''}
                          onChange={(e) => setSiteSettings({ ...siteSettings, announcement_bar: e.target.value })}
                          className="w-full px-3 py-2 text-xs bg-[#1A1A18] border border-[#2B2B28] rounded text-white outline-none focus:border-[#C6A87D]"
                          placeholder="np. Darmowa dostawa w Polsce · Kup 2, trzeci durag za 1 zł"
                        />
                      </div>
                      <div>
                        <label className="text-[11px] text-[#A1A1A8] block mb-1">Tekst paska (EN):</label>
                        <input
                          type="text"
                          value={siteSettings.announcement_bar_en || ''}
                          onChange={(e) => setSiteSettings({ ...siteSettings, announcement_bar_en: e.target.value })}
                          className="w-full px-3 py-2 text-xs bg-[#1A1A18] border border-[#2B2B28] rounded text-white outline-none focus:border-[#C6A87D]"
                          placeholder="e.g. Free shipping in Poland · Buy 2, get 3rd random durag for €0.25"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="bg-[#181816] p-4 rounded border border-[#262624] space-y-4">
                    <h4 className="text-xs uppercase tracking-wider text-[#C6A87D] font-bold">
                      Sekcja Główna Hero (Homepage)
                    </h4>

                    {/* Badge */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div>
                        <label className="text-[11px] text-[#A1A1A8] block mb-1">Odznaka / Badge (PL):</label>
                        <input
                          type="text"
                          value={siteSettings.hero_badge || ''}
                          onChange={(e) => setSiteSettings({ ...siteSettings, hero_badge: e.target.value })}
                          className="w-full px-3 py-2 text-xs bg-[#1A1A18] border border-[#2B2B28] rounded text-white outline-none focus:border-[#C6A87D]"
                          placeholder="Atelier Warszawa · 100% Mulberry Silk"
                        />
                      </div>
                      <div>
                        <label className="text-[11px] text-[#A1A1A8] block mb-1">Odznaka / Badge (EN):</label>
                        <input
                          type="text"
                          value={siteSettings.hero_badge_en || ''}
                          onChange={(e) => setSiteSettings({ ...siteSettings, hero_badge_en: e.target.value })}
                          className="w-full px-3 py-2 text-xs bg-[#1A1A18] border border-[#2B2B28] rounded text-white outline-none focus:border-[#C6A87D]"
                          placeholder="Warsaw Atelier · 100% Mulberry Silk"
                        />
                      </div>
                    </div>

                    {/* H1 Title */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div>
                        <label className="text-[11px] text-[#A1A1A8] block mb-1">Główny Tytuł H1 (PL):</label>
                        <input
                          type="text"
                          value={siteSettings.hero_title || ''}
                          onChange={(e) => setSiteSettings({ ...siteSettings, hero_title: e.target.value })}
                          className="w-full px-3 py-2 text-xs bg-[#1A1A18] border border-[#2B2B28] rounded text-white outline-none focus:border-[#C6A87D]"
                        />
                      </div>
                      <div>
                        <label className="text-[11px] text-[#A1A1A8] block mb-1">Główny Tytuł H1 (EN):</label>
                        <input
                          type="text"
                          value={siteSettings.hero_title_en || ''}
                          onChange={(e) => setSiteSettings({ ...siteSettings, hero_title_en: e.target.value })}
                          className="w-full px-3 py-2 text-xs bg-[#1A1A18] border border-[#2B2B28] rounded text-white outline-none focus:border-[#C6A87D]"
                        />
                      </div>
                    </div>

                    {/* Subtitle */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div>
                        <label className="text-[11px] text-[#A1A1A8] block mb-1">Podtytuł Hero (PL):</label>
                        <textarea
                          rows={3}
                          value={siteSettings.hero_subtitle || ''}
                          onChange={(e) => setSiteSettings({ ...siteSettings, hero_subtitle: e.target.value })}
                          className="w-full px-3 py-2 text-xs bg-[#1A1A18] border border-[#2B2B28] rounded text-white outline-none focus:border-[#C6A87D]"
                        />
                      </div>
                      <div>
                        <label className="text-[11px] text-[#A1A1A8] block mb-1">Podtytuł Hero (EN):</label>
                        <textarea
                          rows={3}
                          value={siteSettings.hero_subtitle_en || ''}
                          onChange={(e) => setSiteSettings({ ...siteSettings, hero_subtitle_en: e.target.value })}
                          className="w-full px-3 py-2 text-xs bg-[#1A1A18] border border-[#2B2B28] rounded text-white outline-none focus:border-[#C6A87D]"
                        />
                      </div>
                    </div>

                    {/* CTA Button */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="text-[11px] text-[#A1A1A8] block mb-1">Tekst przycisku (PL):</label>
                        <input
                          type="text"
                          value={siteSettings.hero_cta_text || ''}
                          onChange={(e) => setSiteSettings({ ...siteSettings, hero_cta_text: e.target.value })}
                          className="w-full px-3 py-2 text-xs bg-[#1A1A18] border border-[#2B2B28] rounded text-white outline-none focus:border-[#C6A87D]"
                        />
                      </div>
                      <div>
                        <label className="text-[11px] text-[#A1A1A8] block mb-1">Tekst przycisku (EN):</label>
                        <input
                          type="text"
                          value={siteSettings.hero_cta_text_en || ''}
                          onChange={(e) => setSiteSettings({ ...siteSettings, hero_cta_text_en: e.target.value })}
                          className="w-full px-3 py-2 text-xs bg-[#1A1A18] border border-[#2B2B28] rounded text-white outline-none focus:border-[#C6A87D]"
                        />
                      </div>
                      <div>
                        <label className="text-[11px] text-[#A1A1A8] block mb-1">Link przycisku:</label>
                        <input
                          type="text"
                          value={siteSettings.hero_cta_link || '#kolekcja'}
                          onChange={(e) => setSiteSettings({ ...siteSettings, hero_cta_link: e.target.value })}
                          className="w-full px-3 py-2 text-xs bg-[#1A1A18] border border-[#2B2B28] rounded text-white outline-none focus:border-[#C6A87D]"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* ------------------------------------------------------------------ */}
              {/* SUB-SECTION 2: PROMOTION 2+1 */}
              {/* ------------------------------------------------------------------ */}
              {cmsSubTab === 'promo' && (
                <div className="bg-[#181816] p-4 rounded border border-[#262624] space-y-4">
                  <h4 className="text-xs uppercase tracking-wider text-[#C6A87D] font-bold">
                    Pasek & Baner Promocji 2+1 (Trzeci za 1 zł)
                  </h4>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <label className="text-[11px] text-[#A1A1A8] block mb-1">Tytuł banera (PL):</label>
                      <input
                        type="text"
                        value={siteSettings.promo_strip_title || ''}
                        onChange={(e) => setSiteSettings({ ...siteSettings, promo_strip_title: e.target.value })}
                        className="w-full px-3 py-2 text-xs bg-[#1A1A18] border border-[#2B2B28] rounded text-white outline-none focus:border-[#C6A87D]"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] text-[#A1A1A8] block mb-1">Tytuł banera (EN):</label>
                      <input
                        type="text"
                        value={siteSettings.promo_strip_title_en || ''}
                        onChange={(e) => setSiteSettings({ ...siteSettings, promo_strip_title_en: e.target.value })}
                        className="w-full px-3 py-2 text-xs bg-[#1A1A18] border border-[#2B2B28] rounded text-white outline-none focus:border-[#C6A87D]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <label className="text-[11px] text-[#A1A1A8] block mb-1">Opis promocji (PL):</label>
                      <textarea
                        rows={3}
                        value={siteSettings.promo_strip_desc || ''}
                        onChange={(e) => setSiteSettings({ ...siteSettings, promo_strip_desc: e.target.value })}
                        className="w-full px-3 py-2 text-xs bg-[#1A1A18] border border-[#2B2B28] rounded text-white outline-none focus:border-[#C6A87D]"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] text-[#A1A1A8] block mb-1">Opis promocji (EN):</label>
                      <textarea
                        rows={3}
                        value={siteSettings.promo_strip_desc_en || ''}
                        onChange={(e) => setSiteSettings({ ...siteSettings, promo_strip_desc_en: e.target.value })}
                        className="w-full px-3 py-2 text-xs bg-[#1A1A18] border border-[#2B2B28] rounded text-white outline-none focus:border-[#C6A87D]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <label className="text-[11px] text-[#A1A1A8] block mb-1">Przycisk CTA (PL):</label>
                      <input
                        type="text"
                        value={siteSettings.promo_strip_cta || ''}
                        onChange={(e) => setSiteSettings({ ...siteSettings, promo_strip_cta: e.target.value })}
                        className="w-full px-3 py-2 text-xs bg-[#1A1A18] border border-[#2B2B28] rounded text-white outline-none focus:border-[#C6A87D]"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] text-[#A1A1A8] block mb-1">Przycisk CTA (EN):</label>
                      <input
                        type="text"
                        value={siteSettings.promo_strip_cta_en || ''}
                        onChange={(e) => setSiteSettings({ ...siteSettings, promo_strip_cta_en: e.target.value })}
                        className="w-full px-3 py-2 text-xs bg-[#1A1A18] border border-[#2B2B28] rounded text-white outline-none focus:border-[#C6A87D]"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* ------------------------------------------------------------------ */}
              {/* SUB-SECTION 3: CATALOG & FABRICS */}
              {/* ------------------------------------------------------------------ */}
              {cmsSubTab === 'catalog' && (
                <div className="bg-[#181816] p-4 rounded border border-[#262624] space-y-4">
                  <h4 className="text-xs uppercase tracking-wider text-[#C6A87D] font-bold">
                    Nagłówki Sekcji Katalogu & Tkanin
                  </h4>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <label className="text-[11px] text-[#A1A1A8] block mb-1">Tytuł Bestsellery (PL):</label>
                      <input
                        type="text"
                        value={siteSettings.bestsellers_title || ''}
                        onChange={(e) => setSiteSettings({ ...siteSettings, bestsellers_title: e.target.value })}
                        className="w-full px-3 py-2 text-xs bg-[#1A1A18] border border-[#2B2B28] rounded text-white outline-none focus:border-[#C6A87D]"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] text-[#A1A1A8] block mb-1">Tytuł Bestsellery (EN):</label>
                      <input
                        type="text"
                        value={siteSettings.bestsellers_title_en || ''}
                        onChange={(e) => setSiteSettings({ ...siteSettings, bestsellers_title_en: e.target.value })}
                        className="w-full px-3 py-2 text-xs bg-[#1A1A18] border border-[#2B2B28] rounded text-white outline-none focus:border-[#C6A87D]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <label className="text-[11px] text-[#A1A1A8] block mb-1">Tytuł Wybierz Materiał (PL):</label>
                      <input
                        type="text"
                        value={siteSettings.choose_fabric_title || ''}
                        onChange={(e) => setSiteSettings({ ...siteSettings, choose_fabric_title: e.target.value })}
                        className="w-full px-3 py-2 text-xs bg-[#1A1A18] border border-[#2B2B28] rounded text-white outline-none focus:border-[#C6A87D]"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] text-[#A1A1A8] block mb-1">Tytuł Wybierz Materiał (EN):</label>
                      <input
                        type="text"
                        value={siteSettings.choose_fabric_title_en || ''}
                        onChange={(e) => setSiteSettings({ ...siteSettings, choose_fabric_title_en: e.target.value })}
                        className="w-full px-3 py-2 text-xs bg-[#1A1A18] border border-[#2B2B28] rounded text-white outline-none focus:border-[#C6A87D]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <label className="text-[11px] text-[#A1A1A8] block mb-1">Opis tkanin (PL):</label>
                      <textarea
                        rows={2}
                        value={siteSettings.choose_fabric_desc || ''}
                        onChange={(e) => setSiteSettings({ ...siteSettings, choose_fabric_desc: e.target.value })}
                        className="w-full px-3 py-2 text-xs bg-[#1A1A18] border border-[#2B2B28] rounded text-white outline-none focus:border-[#C6A87D]"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] text-[#A1A1A8] block mb-1">Opis tkanin (EN):</label>
                      <textarea
                        rows={2}
                        value={siteSettings.choose_fabric_desc_en || ''}
                        onChange={(e) => setSiteSettings({ ...siteSettings, choose_fabric_desc_en: e.target.value })}
                        className="w-full px-3 py-2 text-xs bg-[#1A1A18] border border-[#2B2B28] rounded text-white outline-none focus:border-[#C6A87D]"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* ------------------------------------------------------------------ */}
              {/* SUB-SECTION 4: ABOUT US & FOUNDERS */}
              {/* ------------------------------------------------------------------ */}
              {cmsSubTab === 'about' && (
                <div className="bg-[#181816] p-4 rounded border border-[#262624] space-y-4">
                  <h4 className="text-xs uppercase tracking-wider text-[#C6A87D] font-bold">
                    O nas, Założyciele & Pracownia w Warszawie
                  </h4>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <label className="text-[11px] text-[#A1A1A8] block mb-1">Nagłówek sekcji O nas (PL):</label>
                      <input
                        type="text"
                        value={siteSettings.about_title || ''}
                        onChange={(e) => setSiteSettings({ ...siteSettings, about_title: e.target.value })}
                        className="w-full px-3 py-2 text-xs bg-[#1A1A18] border border-[#2B2B28] rounded text-white outline-none focus:border-[#C6A87D]"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] text-[#A1A1A8] block mb-1">Nagłówek sekcji O nas (EN):</label>
                      <input
                        type="text"
                        value={siteSettings.about_title_en || ''}
                        onChange={(e) => setSiteSettings({ ...siteSettings, about_title_en: e.target.value })}
                        className="w-full px-3 py-2 text-xs bg-[#1A1A18] border border-[#2B2B28] rounded text-white outline-none focus:border-[#C6A87D]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <label className="text-[11px] text-[#A1A1A8] block mb-1">Opis pracowni i braci bliźniaków (PL):</label>
                      <textarea
                        rows={4}
                        value={siteSettings.about_description || ''}
                        onChange={(e) => setSiteSettings({ ...siteSettings, about_description: e.target.value })}
                        className="w-full px-3 py-2 text-xs bg-[#1A1A18] border border-[#2B2B28] rounded text-white outline-none focus:border-[#C6A87D]"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] text-[#A1A1A8] block mb-1">Opis pracowni i braci bliźniaków (EN):</label>
                      <textarea
                        rows={4}
                        value={siteSettings.about_description_en || ''}
                        onChange={(e) => setSiteSettings({ ...siteSettings, about_description_en: e.target.value })}
                        className="w-full px-3 py-2 text-xs bg-[#1A1A18] border border-[#2B2B28] rounded text-white outline-none focus:border-[#C6A87D]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <label className="text-[11px] text-[#A1A1A8] block mb-1">Informacja o odbiorze w Warszawie (PL):</label>
                      <input
                        type="text"
                        value={siteSettings.about_pickup_info || ''}
                        onChange={(e) => setSiteSettings({ ...siteSettings, about_pickup_info: e.target.value })}
                        className="w-full px-3 py-2 text-xs bg-[#1A1A18] border border-[#2B2B28] rounded text-white outline-none focus:border-[#C6A87D]"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] text-[#A1A1A8] block mb-1">Informacja o odbiorze w Warszawie (EN):</label>
                      <input
                        type="text"
                        value={siteSettings.about_pickup_info_en || ''}
                        onChange={(e) => setSiteSettings({ ...siteSettings, about_pickup_info_en: e.target.value })}
                        className="w-full px-3 py-2 text-xs bg-[#1A1A18] border border-[#2B2B28] rounded text-white outline-none focus:border-[#C6A87D]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[11px] text-[#A1A1A8] block mb-1">Ścieżka do zdjęcia założycieli (URL):</label>
                    <input
                      type="text"
                      value={siteSettings.about_image_url || '/assets/founders.jpg'}
                      onChange={(e) => setSiteSettings({ ...siteSettings, about_image_url: e.target.value })}
                      className="w-full px-3 py-2 text-xs bg-[#1A1A18] border border-[#2B2B28] rounded text-white outline-none focus:border-[#C6A87D]"
                      placeholder="/assets/founders.jpg"
                    />
                  </div>
                </div>
              )}

              {/* ------------------------------------------------------------------ */}
              {/* SUB-SECTION 5: TRUST FACTS */}
              {/* ------------------------------------------------------------------ */}
              {cmsSubTab === 'trust' && (
                <div className="bg-[#181816] p-4 rounded border border-[#262624] space-y-4">
                  <h4 className="text-xs uppercase tracking-wider text-[#C6A87D] font-bold">
                    Pasek Zaufania (4 Kluczowe Wyróżniki Sklepu)
                  </h4>

                  {/* Fact 1 */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <label className="text-[11px] text-[#A1A1A8] block mb-1">Wyróżnik 1 (PL):</label>
                      <input
                        type="text"
                        value={siteSettings.trust_fact_1 || ''}
                        onChange={(e) => setSiteSettings({ ...siteSettings, trust_fact_1: e.target.value })}
                        className="w-full px-3 py-2 text-xs bg-[#1A1A18] border border-[#2B2B28] rounded text-white outline-none focus:border-[#C6A87D]"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] text-[#A1A1A8] block mb-1">Wyróżnik 1 (EN):</label>
                      <input
                        type="text"
                        value={siteSettings.trust_fact_1_en || ''}
                        onChange={(e) => setSiteSettings({ ...siteSettings, trust_fact_1_en: e.target.value })}
                        className="w-full px-3 py-2 text-xs bg-[#1A1A18] border border-[#2B2B28] rounded text-white outline-none focus:border-[#C6A87D]"
                      />
                    </div>
                  </div>

                  {/* Fact 2 */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <label className="text-[11px] text-[#A1A1A8] block mb-1">Wyróżnik 2 (PL):</label>
                      <input
                        type="text"
                        value={siteSettings.trust_fact_2 || ''}
                        onChange={(e) => setSiteSettings({ ...siteSettings, trust_fact_2: e.target.value })}
                        className="w-full px-3 py-2 text-xs bg-[#1A1A18] border border-[#2B2B28] rounded text-white outline-none focus:border-[#C6A87D]"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] text-[#A1A1A8] block mb-1">Wyróżnik 2 (EN):</label>
                      <input
                        type="text"
                        value={siteSettings.trust_fact_2_en || ''}
                        onChange={(e) => setSiteSettings({ ...siteSettings, trust_fact_2_en: e.target.value })}
                        className="w-full px-3 py-2 text-xs bg-[#1A1A18] border border-[#2B2B28] rounded text-white outline-none focus:border-[#C6A87D]"
                      />
                    </div>
                  </div>

                  {/* Fact 3 */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <label className="text-[11px] text-[#A1A1A8] block mb-1">Wyróżnik 3 (PL):</label>
                      <input
                        type="text"
                        value={siteSettings.trust_fact_3 || ''}
                        onChange={(e) => setSiteSettings({ ...siteSettings, trust_fact_3: e.target.value })}
                        className="w-full px-3 py-2 text-xs bg-[#1A1A18] border border-[#2B2B28] rounded text-white outline-none focus:border-[#C6A87D]"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] text-[#A1A1A8] block mb-1">Wyróżnik 3 (EN):</label>
                      <input
                        type="text"
                        value={siteSettings.trust_fact_3_en || ''}
                        onChange={(e) => setSiteSettings({ ...siteSettings, trust_fact_3_en: e.target.value })}
                        className="w-full px-3 py-2 text-xs bg-[#1A1A18] border border-[#2B2B28] rounded text-white outline-none focus:border-[#C6A87D]"
                      />
                    </div>
                  </div>

                  {/* Fact 4 */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <label className="text-[11px] text-[#A1A1A8] block mb-1">Wyróżnik 4 (PL):</label>
                      <input
                        type="text"
                        value={siteSettings.trust_fact_4 || ''}
                        onChange={(e) => setSiteSettings({ ...siteSettings, trust_fact_4: e.target.value })}
                        className="w-full px-3 py-2 text-xs bg-[#1A1A18] border border-[#2B2B28] rounded text-white outline-none focus:border-[#C6A87D]"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] text-[#A1A1A8] block mb-1">Wyróżnik 4 (EN):</label>
                      <input
                        type="text"
                        value={siteSettings.trust_fact_4_en || ''}
                        onChange={(e) => setSiteSettings({ ...siteSettings, trust_fact_4_en: e.target.value })}
                        className="w-full px-3 py-2 text-xs bg-[#1A1A18] border border-[#2B2B28] rounded text-white outline-none focus:border-[#C6A87D]"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* ------------------------------------------------------------------ */}
              {/* SUB-SECTION 6: FAQ INTERACTIVE LIST */}
              {/* ------------------------------------------------------------------ */}
              {cmsSubTab === 'faq' && (
                <div className="bg-[#181816] p-4 rounded border border-[#262624] space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-xs uppercase tracking-wider text-[#C6A87D] font-bold">
                        Pytania i Odpowiedzi (FAQ)
                      </h4>
                      <p className="text-[11px] text-[#8C8D94]">
                        Edytuj pytania i odpowiedzi, dodawaj nowe lub usuwaj niepotrzebne.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={addFaqItem}
                      className="px-3 py-1.5 bg-[#C6A87D] hover:bg-[#D4AF37] text-black text-xs font-bold rounded flex items-center gap-1"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Dodaj Pytanie</span>
                    </button>
                  </div>

                  <div className="space-y-4 divide-y divide-[#2B2B28] pt-2">
                    {faqList.map((faq, idx) => (
                      <div key={idx} className="pt-4 first:pt-0 space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-mono text-[#C6A87D] font-bold">
                            Pytanie #{idx + 1}
                          </span>
                          <button
                            type="button"
                            onClick={() => removeFaqItem(idx)}
                            className="p-1 text-[#FF8A8A] hover:bg-[#3D1F1F] rounded"
                            title="Usuń to pytanie"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        {/* Questions PL & EN */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          <div>
                            <label className="text-[10px] uppercase tracking-wider text-[#8C8D94] block mb-1">
                              Pytanie (PL):
                            </label>
                            <input
                              type="text"
                              value={faq.q_pl || ''}
                              onChange={(e) => updateFaqItem(idx, 'q_pl', e.target.value)}
                              className="w-full px-3 py-2 text-xs bg-[#1A1A18] border border-[#2B2B28] rounded text-white outline-none focus:border-[#C6A87D]"
                            />
                          </div>
                          <div>
                            <label className="text-[10px] uppercase tracking-wider text-[#8C8D94] block mb-1">
                              Pytanie (EN):
                            </label>
                            <input
                              type="text"
                              value={faq.q_en || ''}
                              onChange={(e) => updateFaqItem(idx, 'q_en', e.target.value)}
                              className="w-full px-3 py-2 text-xs bg-[#1A1A18] border border-[#2B2B28] rounded text-white outline-none focus:border-[#C6A87D]"
                            />
                          </div>
                        </div>

                        {/* Answers PL & EN */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          <div>
                            <label className="text-[10px] uppercase tracking-wider text-[#8C8D94] block mb-1">
                              Odpowiedź (PL):
                            </label>
                            <textarea
                              rows={2}
                              value={faq.a_pl || ''}
                              onChange={(e) => updateFaqItem(idx, 'a_pl', e.target.value)}
                              className="w-full px-3 py-2 text-xs bg-[#1A1A18] border border-[#2B2B28] rounded text-white outline-none focus:border-[#C6A87D]"
                            />
                          </div>
                          <div>
                            <label className="text-[10px] uppercase tracking-wider text-[#8C8D94] block mb-1">
                              Odpowiedź (EN):
                            </label>
                            <textarea
                              rows={2}
                              value={faq.a_en || ''}
                              onChange={(e) => updateFaqItem(idx, 'a_en', e.target.value)}
                              className="w-full px-3 py-2 text-xs bg-[#1A1A18] border border-[#2B2B28] rounded text-white outline-none focus:border-[#C6A87D]"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* ------------------------------------------------------------------ */}
              {/* SUB-SECTION 7: CONTACT & STORE INFO */}
              {/* ------------------------------------------------------------------ */}
              {cmsSubTab === 'contact' && (
                <div className="bg-[#181816] p-4 rounded border border-[#262624] space-y-4">
                  <h4 className="text-xs uppercase tracking-wider text-[#C6A87D] font-bold">
                    Dane Kontaktowe Sklepu & Social Media
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="text-[11px] text-[#A1A1A8] block mb-1">E-mail obsługi klienta:</label>
                      <input
                        type="email"
                        value={siteSettings.contact_email || ''}
                        onChange={(e) => setSiteSettings({ ...siteSettings, contact_email: e.target.value })}
                        className="w-full px-3 py-2 text-xs bg-[#1A1A18] border border-[#2B2B28] rounded text-white outline-none focus:border-[#C6A87D]"
                        placeholder="support@warsawduragstore.com"
                      />
                    </div>

                    <div>
                      <label className="text-[11px] text-[#A1A1A8] block mb-1">Telefon kontaktowy:</label>
                      <input
                        type="text"
                        value={siteSettings.contact_phone || ''}
                        onChange={(e) => setSiteSettings({ ...siteSettings, contact_phone: e.target.value })}
                        className="w-full px-3 py-2 text-xs bg-[#1A1A18] border border-[#2B2B28] rounded text-white outline-none focus:border-[#C6A87D]"
                        placeholder="+48 797 786 024"
                      />
                    </div>

                    <div>
                      <label className="text-[11px] text-[#A1A1A8] block mb-1">Instagram (@profil):</label>
                      <input
                        type="text"
                        value={siteSettings.instagram_handle || ''}
                        onChange={(e) => setSiteSettings({ ...siteSettings, instagram_handle: e.target.value })}
                        className="w-full px-3 py-2 text-xs bg-[#1A1A18] border border-[#2B2B28] rounded text-white outline-none focus:border-[#C6A87D]"
                        placeholder="@warsawduragstore"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Bottom Save Action */}
              <div className="pt-2 flex items-center justify-between border-t border-[#242421]">
                <span className="text-[11px] text-[#8C8D94]">
                  Zmiany zapisują się natychmiast w bazie Supabase i aktualizują sklep na żywo.
                </span>

                <button
                  type="submit"
                  disabled={isSavingSettings}
                  className="px-6 py-3 bg-[#C6A87D] hover:bg-[#D4AF37] text-black text-xs uppercase tracking-widest font-bold rounded transition-colors flex items-center gap-2 disabled:opacity-50 shadow-md"
                >
                  {isSavingSettings ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Zapisywanie w bazie...</span>
                    </>
                  ) : (
                    <>
                      <Check className="w-4 h-4" />
                      <span>Zapisz Wszystkie Zmiany</span>
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
        <div className="admin-modal-backdrop fixed inset-0 z-50 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="admin-modal-card bg-white border border-[#D5D0C7] rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl my-8 text-[#141416]">
            <div className="p-5 border-b border-[#E5E0D6] flex items-center justify-between sticky top-0 bg-[#FAF9F6] z-10 rounded-t-2xl">
              <h3 className="font-serif text-lg text-[#141416] font-bold">
                {editingProductId ? `Edycja Produktu #${editingProductId}` : 'Nowy Produkt w Katalogu'}
              </h3>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 text-[#55524E] hover:text-[#141416] hover:bg-[#EAE6DF] rounded-lg transition-colors"
                title="Zamknij"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="p-6 space-y-5 text-sm bg-white">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-[#1C1A17] font-semibold text-xs block mb-1.5">
                    Nazwa produktu (PL) <span className="text-[#B85C2E]">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-white border border-[#C5BFB5] rounded-lg text-[#141416] font-medium placeholder:text-[#8C8D94] outline-none focus:border-[#B85C2E] focus:ring-2 focus:ring-[#B85C2E]/20 transition-all shadow-xs"
                  />
                </div>

                <div>
                  <label className="text-[#1C1A17] font-semibold text-xs block mb-1.5">
                    Nazwa produktu (EN)
                  </label>
                  <input
                    type="text"
                    value={nameEn}
                    onChange={(e) => setNameEn(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-white border border-[#C5BFB5] rounded-lg text-[#141416] font-medium placeholder:text-[#8C8D94] outline-none focus:border-[#B85C2E] focus:ring-2 focus:ring-[#B85C2E]/20 transition-all shadow-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="text-[#1C1A17] font-semibold text-xs block mb-1.5">
                    Cena (PLN) <span className="text-[#B85C2E]">*</span>
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-white border border-[#C5BFB5] rounded-lg text-[#141416] font-mono font-semibold outline-none focus:border-[#B85C2E] focus:ring-2 focus:ring-[#B85C2E]/20 transition-all shadow-xs"
                  />
                </div>

                <div>
                  <label className="text-[#1C1A17] font-semibold text-xs block mb-1.5">
                    Kategoria
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="w-full px-3.5 py-2.5 bg-white border border-[#C5BFB5] rounded-lg text-[#141416] font-medium outline-none focus:border-[#B85C2E] focus:ring-2 focus:ring-[#B85C2E]/20 transition-all shadow-xs"
                  >
                    <option value="silk">Jedwab Morwowy (silk)</option>
                    <option value="satin">Satyna (satin)</option>
                    <option value="velvet">Welur (velvet)</option>
                    <option value="seasonal">Sezonowe (seasonal)</option>
                    <option value="accessories">Akcesoria (accessories)</option>
                  </select>
                </div>

                <div>
                  <label className="text-[#1C1A17] font-semibold text-xs block mb-1.5">
                    Stan magazynowy (szt.)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={stock}
                    onChange={(e) => setStock(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-white border border-[#C5BFB5] rounded-lg text-[#141416] font-mono font-semibold outline-none focus:border-[#B85C2E] focus:ring-2 focus:ring-[#B85C2E]/20 transition-all shadow-xs"
                  />
                </div>
              </div>

              <div>
                <label className="text-[#1C1A17] font-semibold text-xs block mb-1.5">
                  Materiał (opis specyfikacji)
                </label>
                <input
                  type="text"
                  value={material}
                  onChange={(e) => setMaterial(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-white border border-[#C5BFB5] rounded-lg text-[#141416] font-medium placeholder:text-[#8C8D94] outline-none focus:border-[#B85C2E] focus:ring-2 focus:ring-[#B85C2E]/20 transition-all shadow-xs"
                />
              </div>

              <div>
                <label className="text-[#1C1A17] font-semibold text-xs block mb-1.5">
                  Opis produktu
                </label>
                <textarea
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-white border border-[#C5BFB5] rounded-lg text-[#141416] leading-relaxed placeholder:text-[#8C8D94] outline-none focus:border-[#B85C2E] focus:ring-2 focus:ring-[#B85C2E]/20 transition-all shadow-xs"
                />
              </div>

              {/* Images Gallery Manager */}
              <div className="space-y-3 pt-4 border-t border-[#E5E0D6]">
                <label className="text-[#1C1A17] font-bold text-xs uppercase tracking-wider block">
                  Galeria Zdjęć
                </label>
                
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Wklej ścieżkę lub URL zdjęcia (np. /assets/... lub https://...)"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    className="flex-grow px-3.5 py-2.5 bg-white border border-[#C5BFB5] rounded-lg text-[#141416] text-xs placeholder:text-[#8C8D94] outline-none focus:border-[#B85C2E] focus:ring-2 focus:ring-[#B85C2E]/20 transition-all shadow-xs"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (imageUrl.trim()) {
                        setImages([...images, imageUrl.trim()]);
                        setImageUrl('');
                      }
                    }}
                    className="px-4 py-2 bg-[#141416] hover:bg-[#2D2C2A] text-white font-semibold text-xs rounded-lg transition-colors shadow-xs"
                  >
                    Dodaj
                  </button>
                </div>

                <div className="flex flex-wrap gap-2.5 pt-1">
                  {images.map((img, idx) => (
                    <div
                      key={idx}
                      className="relative w-16 h-16 bg-[#FAF9F6] rounded-lg border border-[#D5D0C7] overflow-hidden group shadow-xs"
                    >
                      <Image src={img} alt="" fill className="object-cover" />
                      <button
                        type="button"
                        onClick={() => setImages(images.filter((_, i) => i !== idx))}
                        className="absolute inset-0 bg-black/70 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                        title="Usuń zdjęcie"
                      >
                        <Trash2 className="w-4 h-4 text-red-400" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="pt-4 border-t border-[#E5E0D6] flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 bg-[#EAE6DF] hover:bg-[#DFDAD1] text-[#141416] font-semibold text-sm rounded-lg border border-[#C5BFB5] transition-colors"
                >
                  Anuluj
                </button>
                <button
                  type="submit"
                  disabled={isSyncing}
                  className="px-6 py-2.5 bg-[#B85C2E] hover:bg-[#A04F25] text-white font-bold text-sm uppercase tracking-wider rounded-lg transition-all shadow-md hover:shadow-lg disabled:opacity-50"
                >
                  {isSyncing ? 'Zapisywanie w bazie...' : 'Zapisz Produkt'}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* ORDER DETAILS & FULL PURCHASE LOG MODAL */}
      {/* ==================================================================== */}
      {selectedOrderForModal && (
        <div className="admin-modal-backdrop fixed inset-0 z-50 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="admin-modal-card bg-white border border-[#D5D0C7] rounded-2xl w-full max-w-3xl max-h-[92vh] overflow-y-auto shadow-2xl my-6 flex flex-col text-[#141416]">
            
            {/* Modal Header */}
            <div className="p-5 border-b border-[#E5E0D6] flex items-center justify-between sticky top-0 bg-[#FAF9F6] z-10 rounded-t-2xl">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-[#EAE6DF] border border-[#D5D0C7] flex items-center justify-center text-[#B85C2E]">
                  <FileText className="w-4 h-4" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-mono text-base text-[#141416] font-bold">
                      {selectedOrderForModal.order_no}
                    </h3>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#EAE6DF] text-[#55524E] border border-[#D5D0C7]">
                      Log ID: #{selectedOrderForModal.id || 'N/A'}
                    </span>
                  </div>
                  <span className="text-xs text-[#55524E] block">
                    Złożone: {selectedOrderForModal.created_at ? new Date(selectedOrderForModal.created_at).toLocaleString('pl-PL') : 'Bieżące'}
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setSelectedOrderForModal(null)}
                className="p-1.5 text-[#55524E] hover:text-[#141416] hover:bg-[#EAE6DF] rounded-lg transition-colors"
                title="Zamknij podgląd"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-6 flex-grow bg-white">
              
              {/* Quick Status Bar */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-[#FAF9F6] p-4 rounded-xl border border-[#E5E0D6]">
                {/* Order Status */}
                <div>
                  <label className="text-[11px] uppercase tracking-wider text-[#1C1A17] block mb-1.5 font-bold">
                    Status realizacji zamówienia:
                  </label>
                  <select
                    value={selectedOrderForModal.status}
                    onChange={(e) => handleModalOrderStatusChange(e.target.value as SupabaseOrder['status'])}
                    className="w-full px-3 py-2 text-xs bg-white border border-[#C5BFB5] rounded-lg text-[#141416] font-medium outline-none focus:border-[#B85C2E]"
                  >
                    <option value="new">Nowe (do spakowania)</option>
                    <option value="processing">W realizacji</option>
                    <option value="shipped">Wysłane (InPost)</option>
                    <option value="delivered">Dostarczone</option>
                    <option value="pending_payment">Oczekuje na płatność</option>
                    <option value="cancelled">Anulowane</option>
                  </select>
                </div>

                {/* Payment Status */}
                <div>
                  <label className="text-[11px] uppercase tracking-wider text-[#1C1A17] block mb-1.5 font-bold">
                    Status płatności Stripe:
                  </label>
                  <select
                    value={selectedOrderForModal.payment_status || 'pending'}
                    onChange={(e) => handleModalPaymentStatusChange(e.target.value as SupabaseOrder['payment_status'])}
                    className={`w-full px-3 py-2 text-xs border rounded-lg font-bold outline-none ${
                      selectedOrderForModal.payment_status === 'paid'
                        ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
                        : selectedOrderForModal.payment_status === 'failed'
                        ? 'bg-red-50 border-red-300 text-red-800'
                        : selectedOrderForModal.payment_status === 'refunded'
                        ? 'bg-purple-50 border-purple-300 text-purple-800'
                        : 'bg-amber-50 border-amber-300 text-amber-800'
                    }`}
                  >
                    <option value="paid">Opłacone (Płatność potwierdzona)</option>
                    <option value="pending">Oczekuje na wpłatę (Pending)</option>
                    <option value="failed">Nieudana / Odrzucona</option>
                    <option value="refunded">Zwrócona klientowi (Refunded)</option>
                  </select>
                </div>
              </div>

              {/* Customer and Shipping cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                {/* Customer card */}
                <div className="bg-[#FAF9F6] p-4 rounded-xl border border-[#E5E0D6] space-y-3">
                  <h4 className="text-xs uppercase tracking-wider text-[#B85C2E] font-bold flex items-center gap-1.5">
                    <Smartphone className="w-3.5 h-3.5" />
                    Dane Klienta
                  </h4>

                  <div className="space-y-2 text-xs">
                    <div>
                      <span className="text-[#55524E] block text-[11px]">Imię i nazwisko:</span>
                      <strong className="text-[#141416] text-sm">{selectedOrderForModal.customer_name}</strong>
                    </div>

                    <div>
                      <span className="text-[#55524E] block text-[11px]">Adres e-mail:</span>
                      <div className="flex items-center gap-2 mt-0.5">
                        <a
                          href={`mailto:${selectedOrderForModal.customer_email}`}
                          className="text-[#B85C2E] font-medium hover:underline"
                        >
                          {selectedOrderForModal.customer_email}
                        </a>
                        <button
                          type="button"
                          onClick={() => {
                            navigator.clipboard.writeText(selectedOrderForModal.customer_email);
                            showTemporaryToast('Skopiowano e-mail!');
                          }}
                          className="text-[#55524E] hover:text-[#141416] p-0.5"
                          title="Kopiuj email"
                        >
                          <Copy className="w-3 h-3" />
                        </button>
                      </div>
                    </div>

                    <div>
                      <span className="text-[#55524E] block text-[11px]">Telefon:</span>
                      <div className="flex items-center gap-2 mt-0.5">
                        <a
                          href={`tel:${selectedOrderForModal.customer_phone}`}
                          className="text-[#141416] font-medium hover:text-[#B85C2E]"
                        >
                          {selectedOrderForModal.customer_phone}
                        </a>
                        <button
                          type="button"
                          onClick={() => {
                            navigator.clipboard.writeText(selectedOrderForModal.customer_phone);
                            showTemporaryToast('Skopiowano telefon!');
                          }}
                          className="text-[#55524E] hover:text-[#141416] p-0.5"
                          title="Kopiuj telefon"
                        >
                          <Copy className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Delivery card */}
                <div className="bg-[#FAF9F6] p-4 rounded-xl border border-[#E5E0D6] space-y-3">
                  <h4 className="text-xs uppercase tracking-wider text-[#B85C2E] font-bold flex items-center gap-1.5">
                    <Truck className="w-3.5 h-3.5" />
                    Dostawa & Paczkomat
                  </h4>

                  <div className="space-y-2 text-xs">
                    <div>
                      <span className="text-[#55524E] block text-[11px]">Metoda doręczenia:</span>
                      <span className="font-semibold text-[#141416]">
                        {selectedOrderForModal.delivery_method === 'paczkomat'
                          ? 'Paczkomat InPost 24/7'
                          : selectedOrderForModal.delivery_method === 'pickup'
                          ? 'Odbiór osobisty w Warszawie'
                          : 'Kurier'}
                      </span>
                    </div>

                    {selectedOrderForModal.delivery_method === 'paczkomat' && (
                      <div>
                        <span className="text-[#55524E] block text-[11px]">Kod paczkomatu:</span>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="font-mono text-sm font-bold text-[#141416] bg-amber-100 px-2 py-0.5 rounded border border-amber-300">
                            📦 {selectedOrderForModal.locker_code || 'Brak kodu'}
                          </span>
                          {selectedOrderForModal.locker_code && (
                            <a
                              href={`https://inpost.pl/znajdz-paczkomat`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-[11px] text-[#B85C2E] hover:underline flex items-center gap-0.5"
                            >
                              <span>Mapa InPost</span>
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          )}
                        </div>
                      </div>
                    )}

                    <div>
                      <span className="text-[#55524E] block text-[11px]">Adres punktu / dostawy:</span>
                      <p className="text-[#141416] font-medium leading-relaxed mt-0.5">
                        {selectedOrderForModal.locker_address || (selectedOrderForModal.delivery_method === 'pickup' ? 'ul. Włodarzewska 4, Warszawa' : 'Adres klienta')}
                      </p>
                    </div>
                  </div>
                </div>

              </div>

              {/* InPost Tracking Management Card */}
              <div className="bg-[#FAF9F6] p-4 rounded-xl border border-[#E5E0D6] space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs uppercase tracking-wider text-[#B85C2E] font-bold flex items-center gap-1.5">
                    <Package className="w-3.5 h-3.5" />
                    Numer Listu Przewozowego InPost (Tracking)
                  </h4>
                  {selectedOrderForModal.tracking_number && (
                    <a
                      href={`https://inpost.pl/sledzenie-przesylek?number=${selectedOrderForModal.tracking_number}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-emerald-700 hover:underline flex items-center gap-1 font-mono font-bold"
                    >
                      <span>Śledź na inpost.pl</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>

                <div className="flex flex-col sm:flex-row gap-2">
                  <input
                    type="text"
                    value={trackingNumberInput}
                    onChange={(e) => setTrackingNumberInput(e.target.value)}
                    placeholder="Wpisz 24-cyfrowy numer przesyłki InPost..."
                    className="flex-grow px-3.5 py-2 text-xs bg-white border border-[#C5BFB5] rounded-lg text-[#141416] font-mono outline-none focus:border-[#B85C2E]"
                  />
                  <button
                    type="button"
                    onClick={handleSaveTrackingNumber}
                    disabled={isSavingTracking}
                    className="px-4 py-2 bg-[#B85C2E] hover:bg-[#A04F25] text-white text-xs font-bold uppercase tracking-wider rounded-lg transition-colors shrink-0 disabled:opacity-50"
                  >
                    {isSavingTracking ? 'Zapisywanie...' : 'Zapisz Numer Paczki'}
                  </button>
                </div>
                <p className="text-[11px] text-[#55524E]">
                  Wpisanie numeru automatycznie zaktualizuje status na &quot;Wysłane (InPost)&quot; i umożliwi klientowi bezpośrednie śledzenie paczki.
                </p>
              </div>

              {/* Purchased Items Table */}
              <div className="bg-white rounded-xl border border-[#E5E0D6] overflow-hidden space-y-0">
                <div className="p-3.5 bg-[#FAF9F6] border-b border-[#E5E0D6] flex items-center justify-between">
                  <h4 className="text-xs uppercase tracking-wider text-[#1C1A17] font-bold">
                    Zakupione Produkty w Koszyku
                  </h4>
                  <span className="text-xs text-[#55524E]">
                    Łączna kwota zamówienia: <strong className="text-[#141416] font-mono">{Number(selectedOrderForModal.total).toFixed(2)} PLN</strong>
                  </span>
                </div>

                <div className="divide-y divide-[#E5E0D6]">
                  {Array.isArray(selectedOrderForModal.items) && selectedOrderForModal.items.length > 0 ? (
                    selectedOrderForModal.items.map((item: any, idx: number) => (
                      <div key={idx} className="p-3.5 flex items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-lg bg-[#FAF9F6] border border-[#D5D0C7] overflow-hidden shrink-0 relative">
                            {item.image ? (
                              <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-[10px] text-[#55524E]">
                                Foto
                              </div>
                            )}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-semibold text-[#141416]">
                                {item.name}
                              </span>
                              {item.price === 1 && (
                                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold border border-emerald-300">
                                  GRATIS 2+1 (1 zł)
                                </span>
                              )}
                            </div>
                            <div className="text-[11px] text-[#55524E] mt-0.5">
                              {item.variant ? `Wariant: ${item.variant}` : ''}
                              {item.material ? ` · ${item.material}` : ''}
                            </div>
                          </div>
                        </div>

                        <div className="text-right shrink-0">
                          <div className="text-xs font-mono font-bold text-[#141416]">
                            {item.quantity || 1}x {Number(item.price).toFixed(2)} PLN
                          </div>
                          <div className="text-[11px] font-mono font-semibold text-[#B85C2E] mt-0.5">
                            Suma: {((Number(item.price) || 0) * (Number(item.quantity) || 1)).toFixed(2)} PLN
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="p-4 text-xs text-[#55524E]">
                      {selectedOrderForModal.items_summary || 'Brak rozbicia pozycji — szczegóły w surowym logu JSON.'}
                    </div>
                  )}
                </div>

                {/* Financial Summary */}
                <div className="p-4 bg-[#FAF9F6] border-t border-[#E5E0D6] space-y-1 text-xs">
                  <div className="flex justify-between text-[#55524E]">
                    <span>Wartość koszyka (Subtotal):</span>
                    <span className="font-mono font-semibold text-[#141416]">{Number(selectedOrderForModal.subtotal || selectedOrderForModal.total).toFixed(2)} PLN</span>
                  </div>
                  {selectedOrderForModal.discount_code && (
                    <div className="flex justify-between text-emerald-700 font-semibold">
                      <span>Rabat ({selectedOrderForModal.discount_code}):</span>
                      <span className="font-mono">-{Number(selectedOrderForModal.discount_val || 0).toFixed(2)} PLN</span>
                    </div>
                  )}
                  <div className="flex justify-between text-sm font-bold text-[#141416] pt-2 border-t border-[#E5E0D6]">
                    <span>Razem do zapłaty (Total):</span>
                    <span className="font-mono text-[#B85C2E] text-base font-extrabold">{Number(selectedOrderForModal.total).toFixed(2)} PLN</span>
                  </div>
                </div>
              </div>

              {/* Technical / Stripe Session Info */}
              <div className="bg-[#FAF9F6] p-4 rounded-xl border border-[#E5E0D6] space-y-2">
                <h4 className="text-xs uppercase tracking-wider text-[#1C1A17] font-bold">
                  Dane Techniczne Transakcji & Stripe
                </h4>
                <div className="text-xs space-y-1 text-[#55524E]">
                  <div className="flex items-center justify-between">
                    <span>ID Sesji Stripe:</span>
                    <div className="flex items-center gap-1.5 font-mono text-[#141416] font-semibold">
                      <span className="truncate max-w-xs">{selectedOrderForModal.stripe_session_id || 'Brak (Test)'}</span>
                      {selectedOrderForModal.stripe_session_id && (
                        <button
                          type="button"
                          onClick={() => {
                            navigator.clipboard.writeText(selectedOrderForModal.stripe_session_id || '');
                            showTemporaryToast('Skopiowano ID sesji Stripe!');
                          }}
                          className="hover:text-[#B85C2E] p-0.5"
                          title="Kopiuj ID sesji"
                        >
                          <Copy className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Metoda płatności:</span>
                    <span className="text-[#141416] font-semibold">{selectedOrderForModal.payment_method || 'Karta / BLIK / P24'}</span>
                  </div>
                </div>
              </div>

              {/* RAW JSON TRANSACTION LOG */}
              <div className="bg-[#FAF9F6] p-4 rounded-xl border border-[#E5E0D6] space-y-2">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-xs uppercase tracking-wider text-[#1C1A17] font-bold flex items-center gap-1.5">
                      <FileText className="w-3.5 h-3.5 text-[#B85C2E]" />
                      Pełny Log Transakcji (Raw JSON)
                    </h4>
                    <p className="text-[11px] text-[#55524E]">
                      Kompletny rekord z bazy danych Supabase do celów audytowych i integracji.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={copyOrderLogJson}
                    className="px-3 py-1.5 bg-[#EAE6DF] hover:bg-[#DFDAD1] text-[#141416] border border-[#C5BFB5] text-xs font-mono font-semibold rounded-lg transition-colors flex items-center gap-1.5"
                  >
                    {copiedLogJson ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                        <span className="text-emerald-700 font-bold">Skopiowano!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5 text-[#55524E]" />
                        <span>Kopiuj Log JSON</span>
                      </>
                    )}
                  </button>
                </div>

                <pre className="bg-white p-3.5 rounded-lg border border-[#D5D0C7] text-[11px] font-mono text-[#141416] overflow-x-auto max-h-60 leading-relaxed selection:bg-[#B85C2E] selection:text-white">
                  {JSON.stringify(selectedOrderForModal, null, 2)}
                </pre>
              </div>

            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-[#E5E0D6] bg-[#FAF9F6] flex items-center justify-end sticky bottom-0 rounded-b-2xl">
              <button
                type="button"
                onClick={() => setSelectedOrderForModal(null)}
                className="px-5 py-2.5 bg-[#EAE6DF] hover:bg-[#DFDAD1] text-[#141416] text-xs font-bold rounded-lg border border-[#C5BFB5] transition-colors"
              >
                Zamknij
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
