import React, { useState } from 'react';
import { ShopProduct } from '../types';
import { 
  ShoppingBag, Trash2, Edit2, Check, PlusCircle, AlertCircle, 
  Tag, ArrowRight, Heart, Send, CheckCircle2, DollarSign, X, HelpCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import ImageUploadPicker from './ImageUploadPicker';

interface TabShopProps {
  products: ShopProduct[];
  isAdmin: boolean;
  onAddProduct: (item: ShopProduct) => void;
  onUpdateProduct: (item: ShopProduct) => void;
  onDeleteProduct: (id: string) => void;
  whatsappContact: string; // From campaign
}

export default function TabShop({
  products,
  isAdmin,
  onAddProduct,
  onUpdateProduct,
  onDeleteProduct,
  whatsappContact
}: TabShopProps) {
  // Navigation & filter categories
  const [selectedCategory, setSelectedCategory] = useState<string>('Todos');
  const categories = ['Todos', 'Camisas', 'Utensílios', 'Acessórios', 'Tradição', 'Papelaria'];

  // Add product form states
  const [isAdding, setIsAdding] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [newPrice, setNewPrice] = useState<number>(0);
  const [newImage, setNewImage] = useState('');
  const [newCategory, setNewCategory] = useState('Acessórios');
  const [newOptionsLabel, setNewOptionsLabel] = useState('Opções');
  const [newOptionsRaw, setNewOptionsRaw] = useState('');
  const [newPaymentLink, setNewPaymentLink] = useState('');
  const [newIsAvailable, setNewIsAvailable] = useState(true);

  // Editing raw states
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editPrice, setEditPrice] = useState<number>(0);
  const [editImage, setEditImage] = useState('');
  const [editCategory, setEditCategory] = useState('');
  const [editOptionsLabel, setEditOptionsLabel] = useState('');
  const [editOptionsRaw, setEditOptionsRaw] = useState('');
  const [editPaymentLink, setEditPaymentLink] = useState('');
  const [editIsAvailable, setEditIsAvailable] = useState(true);

  // Buy Dialog State
  const [buyingProduct, setBuyingProduct] = useState<ShopProduct | null>(null);
  const [buyerName, setBuyerName] = useState('');
  const [buyerPhone, setBuyerPhone] = useState('');
  const [selectedOption, setSelectedOption] = useState('');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [isOrderSubmitted, setIsOrderSubmitted] = useState(false);

  // Utility to split raw comma-separated options
  const parseOptions = (raw: string): string[] => {
    return raw ? raw.split(',').map(o => o.trim()).filter(o => o.length > 0) : [];
  };

  const handleOpenBuyModal = (prod: ShopProduct) => {
    setBuyingProduct(prod);
    setBuyerName('');
    setBuyerPhone('');
    setDeliveryAddress('');
    setSelectedOption(prod.options && prod.options.length > 0 ? prod.options[0] : '');
    setIsOrderSubmitted(false);
  };

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle || newPrice <= 0) return;

    onAddProduct({
      id: `prod-${Date.now()}`,
      title: newTitle,
      description: newDescription,
      price: Number(newPrice),
      image: newImage || 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&q=80&w=600',
      category: newCategory,
      optionsLabel: newOptionsLabel || undefined,
      options: parseOptions(newOptionsRaw),
      paymentLink: newPaymentLink || undefined,
      isAvailable: newIsAvailable
    });

    // Reset fields
    setIsAdding(false);
    setNewTitle('');
    setNewDescription('');
    setNewPrice(0);
    setNewImage('');
    setNewOptionsRaw('');
    setNewOptionsLabel('Opções');
    setNewPaymentLink('');
    setNewIsAvailable(true);
  };

  const startEdit = (prod: ShopProduct) => {
    setEditingId(prod.id);
    setEditTitle(prod.title);
    setEditDescription(prod.description);
    setEditPrice(prod.price);
    setEditImage(prod.image);
    setEditCategory(prod.category);
    setEditOptionsLabel(prod.optionsLabel || 'Opções');
    setEditOptionsRaw(prod.options ? prod.options.join(', ') : '');
    setEditPaymentLink(prod.paymentLink || '');
    setEditIsAvailable(prod.isAvailable);
  };

  const saveEdit = (id: string) => {
    if (!editTitle || editPrice <= 0) return;
    onUpdateProduct({
      id,
      title: editTitle,
      description: editDescription,
      price: Number(editPrice),
      image: editImage,
      category: editCategory,
      optionsLabel: editOptionsLabel || undefined,
      options: parseOptions(editOptionsRaw),
      paymentLink: editPaymentLink || undefined,
      isAvailable: editIsAvailable
    });
    setEditingId(null);
  };

  const handleOrderCheckout = (e: React.FormEvent) => {
    e.preventDefault();
    if (!buyingProduct || !buyerName || !buyerPhone || !deliveryAddress) return;

    // Build perfect WhatsApp solidary order message
    const formattedPrice = buyingProduct.price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    const message = `Olá! Olhei o site de arrecadação do Gabriel e gostaria de comprar um produto solidário para apoiar a campanha:\n\n` +
      `🛍️ *Produto:* ${buyingProduct.title}\n` +
      `💰 *Valor Unitário:* ${formattedPrice}\n` +
      `⚙️ *Opção Regulada:* ${selectedOption || 'Nenhuma opção selecionada'}\n\n` +
      `👤 *Nome do Apoiador:* ${buyerName}\n` +
      `📞 *WhatsApp do Comprador:* ${buyerPhone}\n` +
      `📍 *Endereço para Envio:* ${deliveryAddress}\n\n` +
      `Já deixei os dados preenchidos no formulário do site e vim acertar os detalhes do envio com você!`;

    // Clear and clean whatsapp format
    const cleanedPhone = whatsappContact ? whatsappContact.replace(/\D/g, '') : '51999999999';
    const waUrl = `https://api.whatsapp.com/send?phone=55${cleanedPhone}&text=${encodeURIComponent(message)}`;

    // Open link
    window.open(waUrl, '_blank');
    setIsOrderSubmitted(true);
  };

  // Filter products based on selected category tag
  const filteredProducts = selectedCategory === 'Todos'
    ? products
    : products.filter(p => p.category.toLowerCase() === selectedCategory.toLowerCase());

  return (
    <div className="space-y-6 animate-fadeIn" id="campaign-shop-tab-view">
      
      {/* 🏡 BEAUTIFUL SHELF DESCRIPTION */}
      <div className="bg-white border border-natural-border rounded-2xl p-5 shadow-xs flex flex-col md:flex-row items-center gap-5">
        <div className="p-3 bg-[#FCFAF2] rounded-3xl shrink-0 border border-amber-200/50">
          <ShoppingBag className="w-8 h-8 text-natural-primary animate-pulse" />
        </div>
        <div className="space-y-1.5 flex-1 text-center md:text-left">
          <h4 className="font-serif italic font-bold text-natural-dark text-base sm:text-lg flex items-center justify-center md:justify-start gap-1.5">
            Lojinha Oficial & Produtos Solidários da Campanha
          </h4>
          <p className="text-xs text-slate-650 leading-relaxed font-sans max-w-4xl">
            Adquira camisetas, cuias artesanais, canecas cerâmicas, bonés e outros acessórios personalizados do Gabriel. 
            <strong> 100% da renda líquida obtida</strong> é revertida para custear a reabilitação continuada do Gabriel Moraes Matos. 
            Escolha seu produto, preencha os dados e finalize sua compra diretamente via WhatsApp ou link de pagamento.
          </p>
        </div>
        
        {isAdmin && !isAdding && (
          <button
            onClick={() => setIsAdding(true)}
            className="h-10 px-4 rounded-xl bg-natural-primary hover:bg-natural-primary-dark text-white font-semibold text-xs flex items-center gap-1.5 shrink-0 transition-colors cursor-pointer shadow-xs"
          >
            <PlusCircle className="w-4 h-4" /> Cadastrar Novo Produto
          </button>
        )}
      </div>

      {/* ➕ FORMULÁRIO DE CADASTRO (ORGANIZADOR APENAS) */}
      {isAdding && (
        <motion.form
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          onSubmit={handleAddSubmit}
          className="bg-[#FAF9F6] border-2 border-dashed border-natural-border rounded-2xl p-5 space-y-4 shadow-2xs"
        >
          <div className="flex items-center justify-between border-b border-natural-border pb-2">
            <span className="text-xs font-bold text-natural-dark tracking-wider flex items-center gap-1.5 font-display">
              <ShoppingBag className="w-4 h-4 text-natural-primary" /> ADICIONAR NOVO PRODUTO À VITRINE SOLIDÁRIA
            </span>
            <button
              type="button"
              onClick={() => setIsAdding(false)}
              className="text-xs text-slate-500 hover:text-slate-800 font-bold focus:outline-none"
            >
              Cancelar
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="md:col-span-2">
              <label className="block text-[10px] font-bold text-[#444430] mb-1">Título do Produto</label>
              <input
                type="text"
                required
                className="w-full h-9 px-3 bg-white border border-natural-border rounded-lg text-xs outline-none focus:border-natural-primary"
                placeholder="Ex: Caneca Oficial de Porcelana Gabriel"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold text-[#444430] mb-1">Preço Sugerido (R$)</label>
              <input
                type="number"
                required
                min="1"
                className="w-full h-9 px-3 bg-white border border-natural-border rounded-lg text-xs outline-none focus:border-natural-primary font-mono font-bold"
                placeholder="Ex: 45"
                value={newPrice || ''}
                onChange={(e) => setNewPrice(Number(e.target.value))}
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold text-[#444430] mb-1">Categoria</label>
              <select
                className="w-full h-9 px-3 bg-white border border-natural-border rounded-lg text-xs outline-none focus:border-natural-primary font-bold text-slate-700"
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
              >
                <option value="Camisas">Camisas</option>
                <option value="Utensílios">Utensílios</option>
                <option value="Acessórios">Acessórios</option>
                <option value="Tradição">Tradição</option>
                <option value="Papelaria">Papelaria</option>
              </select>
            </div>

            <div className="md:col-span-4">
              <label className="block text-[10px] font-bold text-[#444430] mb-1">Descrição Explicativa (Tamanho, Arte, Produção)</label>
              <textarea
                rows={2}
                className="w-full p-2.5 bg-white border border-natural-border rounded-lg text-xs outline-none focus:border-natural-primary leading-relaxed text-slate-650"
                placeholder="Descreva detalhes como material, durabilidade, tamanho ou propósito beneficente..."
                value={newDescription}
                onChange={(e) => setNewDescription(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold text-[#444430] mb-1">Nome do Campo de Opção</label>
              <input
                type="text"
                className="w-full h-9 px-3 bg-white border border-natural-border rounded-lg text-xs outline-none focus:border-natural-primary"
                placeholder="Ex: Tamanhos, Cores, Arte"
                value={newOptionsLabel}
                onChange={(e) => setNewOptionsLabel(e.target.value)}
              />
            </div>

            <div className="md:col-span-3">
              <label className="block text-[10px] font-bold text-[#444430] mb-1">Valores das Opções (Separados por vírgula)</label>
              <input
                type="text"
                className="w-full h-9 px-3 bg-white border border-natural-border rounded-lg text-xs outline-none focus:border-natural-primary"
                placeholder="Ex: P, M, G, GG (Deixe em branco se não houver variações)"
                value={newOptionsRaw}
                onChange={(e) => setNewOptionsRaw(e.target.value)}
              />
            </div>

            <div className="md:col-span-3">
              <label className="block text-[10px] font-bold text-[#444430] mb-1">Link de Pagamento Direto opcional (Asaas, PagBank, Mercado Pago, etc.)</label>
              <input
                type="url"
                className="w-full h-9 px-3 bg-white border border-natural-border rounded-lg text-xs outline-none focus:border-natural-primary font-mono"
                placeholder="https://pix.asaas.com/r/..."
                value={newPaymentLink}
                onChange={(e) => setNewPaymentLink(e.target.value)}
              />
            </div>

            <div className="flex items-center gap-2 pl-2">
              <input
                type="checkbox"
                id="newIsAvailable"
                className="h-4 w-4 rounded border-natural-border text-natural-primary focus:ring-0 cursor-pointer"
                checked={newIsAvailable}
                onChange={(e) => setNewIsAvailable(e.target.checked)}
              />
              <label htmlFor="newIsAvailable" className="text-xs font-bold text-slate-700 cursor-pointer">Disponível em Estoque</label>
            </div>

            <div className="md:col-span-4 border-t border-natural-border pt-4">
              <ImageUploadPicker
                label="Foto de Alta Definição do Produto (Visual na Vitrine)"
                value={newImage}
                onChange={setNewImage}
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 border-t border-natural-border pt-3">
            <button
              type="button"
              onClick={() => setIsAdding(false)}
              className="px-4 h-9 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-5 h-9 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg flex items-center gap-1.5 shadow-xs cursor-pointer"
            >
              Cadastrar Produto
            </button>
          </div>
        </motion.form>
      )}

      {/* 🏷️ TAB FILTERS */}
      <div className="flex flex-wrap items-center gap-2 pb-2 border-b border-natural-border/60 justify-start">
        {categories.map(category => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap outline-none ${
              selectedCategory === category
                ? 'bg-natural-dark text-white shadow-xs scale-[1.02]'
                : 'bg-white hover:bg-[#FAF9F6] text-slate-600 border border-natural-border/80'
            }`}
          >
            {category === 'Todos' ? '🎒 Ver Tudo' : category}
          </button>
        ))}
      </div>

      {/* 🎮 PRODUCTS GRID (BENTO CARD GRID) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6" id="shop-products-grid">
        <AnimatePresence mode="popLayout">
          {filteredProducts.map(product => {
            const isEditingItem = editingId === product.id;

            return (
              <motion.div
                key={product.id}
                layoutId={`prod-card-${product.id}`}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.93 }}
                transition={{ duration: 0.2 }}
                className="bg-white border border-natural-border rounded-3xl overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col justify-between group h-full relative"
              >
                
                {/* Visual Label Tag - Category */}
                <div className="absolute top-3 left-3 z-10 bg-white/90 backdrop-blur-xs px-2.5 py-1 rounded-full border border-slate-150/40 text-[9px] font-extrabold uppercase tracking-widest text-[#5A5A40] flex items-center gap-1">
                  <Tag className="w-2.5 h-2.5 text-natural-primary" />
                  {product.category}
                </div>

                {/* Stock Checker Badge */}
                <div className="absolute top-3 right-3 z-10">
                  {product.isAvailable ? (
                    <span className="bg-emerald-500/90 backdrop-blur-xs text-white text-[9px] font-extrabold px-2.5 py-1 rounded-full uppercase tracking-wider">
                      ✓ Em Estoque
                    </span>
                  ) : (
                    <span className="bg-rose-500/90 backdrop-blur-xs text-white text-[9px] font-extrabold px-2.5 py-1 rounded-full uppercase tracking-wider">
                      ✕ Esgotado
                    </span>
                  )}
                </div>

                {!isEditingItem ? (
                  /* EXIBIÇÃO TRADICIONAL */
                  <>
                    <div className="aspect-square w-full overflow-hidden bg-[#FAF9F6] relative border-b border-natural-border flex items-center justify-center">
                      <img
                        src={product.image}
                        alt={product.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-104"
                        referrerPolicy="no-referrer"
                      />
                      
                      {/* Interactive overlay on hover */}
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                        {product.isAvailable && (
                          <button
                            onClick={() => handleOpenBuyModal(product)}
                            className="bg-white hover:bg-[#FCFAF2] text-natural-dark font-extrabold text-xs px-4 py-2 rounded-xl flex items-center gap-1 shadow-md transition-transform transform active:scale-95 focus:outline-none cursor-pointer"
                          >
                            Apoiar & Comprar
                            <ArrowRight className="w-3.5 h-3.5 text-natural-primary" />
                          </button>
                        )}
                      </div>
                    </div>

                    <div className="p-4 flex-1 flex flex-col justify-between space-y-4">
                      <div className="space-y-1.5">
                        <div className="flex items-start justify-between gap-1">
                          <h5 className="font-display font-extrabold text-[#2F2F1E] text-sm group-hover:text-natural-primary transition-colors line-clamp-1 leading-snug">
                            {product.title}
                          </h5>
                          <span className="font-mono text-xs font-black text-natural-primary whitespace-nowrap">
                            R$ {product.price.toFixed(2).replace('.', ',')}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-550 leading-relaxed font-sans line-clamp-3">
                          {product.description || "Lindo item personalizado feito especialmente para apoiar as terapias multidisciplinares do Gabriel."}
                        </p>
                      </div>

                      {/* Options line display */}
                      {product.options && product.options.length > 0 && (
                        <div className="bg-[#FAF9F6] p-2 rounded-xl text-[10px] space-y-1 border border-natural-border/30">
                          <span className="font-bold text-[#444430] block">{product.optionsLabel || 'Opções'}:</span>
                          <div className="flex flex-wrap gap-1 leading-none">
                            {product.options.map(opt => (
                              <span key={opt} className="bg-white border border-slate-200 px-1.5 py-0.5 rounded text-[9.5px] font-semibold text-slate-600 block shadow-3xs">{opt}</span>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Footer Actions */}
                      <div className="flex items-center gap-1.5 pt-1 justify-between">
                        {product.isAvailable ? (
                          <button
                            onClick={() => handleOpenBuyModal(product)}
                            className="flex-1 bg-natural-primary hover:bg-natural-primary-dark text-white font-extrabold text-[11px] h-9 rounded-xl flex items-center justify-center gap-1 cursor-pointer transition-colors focus:outline-none uppercase tracking-wide shadow-3xs"
                          >
                            <ShoppingBag className="w-3.5 h-3.5" /> Adquirir Item
                          </button>
                        ) : (
                          <div className="flex-1 text-center bg-slate-100 border border-slate-200 text-slate-400 font-bold text-[11px] h-9 rounded-xl flex items-center justify-center">
                            Fora de Estoque
                          </div>
                        )}

                        {/* Admin Tools */}
                        {isAdmin && (
                          <div className="flex gap-1">
                            <button
                              onClick={() => startEdit(product)}
                              className="p-2 border border-blue-200 hover:bg-blue-50 text-blue-600 rounded-xl transition-colors cursor-pointer focus:outline-none"
                              title="Editar Produto"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => {
                                if (window.confirm(`Tem certeza que deseja excluir o produto "${product.title}"?`)) {
                                  onDeleteProduct(product.id);
                                }
                              }}
                              className="p-2 border border-rose-200 hover:bg-rose-50 text-rose-500 rounded-xl transition-colors cursor-pointer focus:outline-none"
                              title="Excluir Produto"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </>
                ) : (
                  /* MODO EDICAO FILTRADA (ADMIN) */
                  <div className="p-4 space-y-3 flex-1 flex flex-col justify-between h-full bg-[#FCFAF2]/80">
                    <div className="space-y-2 flex-grow overflow-y-auto max-h-[350px] pr-0.5">
                      <span className="text-[10px] font-extrabold text-blue-600 uppercase tracking-widest block border-b border-blue-200 pb-1 flex items-center gap-1">
                        <Edit2 className="w-3 h-3" /> Editando Item
                      </span>
                      
                      <div>
                        <label className="block text-[9px] font-bold text-slate-500">Título</label>
                        <input
                          type="text"
                          required
                          className="w-full h-8 px-2 bg-white border border-natural-border rounded-md text-[11px] font-semibold outline-none focus:border-blue-500"
                          value={editTitle}
                          onChange={(e) => setEditTitle(e.target.value)}
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="block text-[9px] font-bold text-slate-500">Preço (R$)</label>
                          <input
                            type="number"
                            required
                            className="w-full h-8 px-2 bg-white border border-natural-border rounded-md text-[11px] font-mono outline-none focus:border-blue-500"
                            value={editPrice}
                            onChange={(e) => setEditPrice(Number(e.target.value))}
                          />
                        </div>
                        <div>
                          <label className="block text-[9px] font-bold text-slate-500">Categoria</label>
                          <select
                            className="w-full h-8 px-1 bg-white border border-natural-border rounded-md text-[11px] text-slate-700 outline-none"
                            value={editCategory}
                            onChange={(e) => setEditCategory(e.target.value)}
                          >
                            <option value="Camisas">Camisas</option>
                            <option value="Utensílios">Utensílios</option>
                            <option value="Acessórios">Acessórios</option>
                            <option value="Tradição">Tradição</option>
                            <option value="Papelaria">Papelaria</option>
                          </select>
                        </div>
                      </div>

                      <div>
                        <label className="block text-[9px] font-bold text-slate-500">Descrição</label>
                        <textarea
                          rows={2}
                          className="w-full p-2 bg-white border border-natural-border rounded-md text-[10px] outline-none text-slate-650"
                          value={editDescription}
                          onChange={(e) => setEditDescription(e.target.value)}
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="block text-[9px] font-bold text-slate-500">Nome Variação</label>
                          <input
                            type="text"
                            className="w-full h-8 px-2 bg-white border border-natural-border rounded-md text-[11px]"
                            placeholder="Ex: Tamanho"
                            value={editOptionsLabel}
                            onChange={(e) => setEditOptionsLabel(e.target.value)}
                          />
                        </div>
                        <div>
                          <label className="block text-[9px] font-bold text-slate-500">Opções (virgulas)</label>
                          <input
                            type="text"
                            className="w-full h-8 px-2 bg-white border border-natural-border rounded-md text-[11px]"
                            placeholder="P, M, G"
                            value={editOptionsRaw}
                            onChange={(e) => setEditOptionsRaw(e.target.value)}
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-[9px] font-bold text-slate-500">Link de Pagamento Dedicado</label>
                        <input
                          type="url"
                          className="w-full h-8 px-2 bg-white border border-natural-border rounded-md text-[11px] font-mono"
                          value={editPaymentLink}
                          onChange={(e) => setEditPaymentLink(e.target.value)}
                        />
                      </div>

                      <div className="flex items-center gap-1.5 py-1">
                        <input
                          type="checkbox"
                          id={`editAvail-${product.id}`}
                          className="h-3.5 w-3.5 rounded border-slate-350"
                          checked={editIsAvailable}
                          onChange={(e) => setEditIsAvailable(e.target.checked)}
                        />
                        <label htmlFor={`editAvail-${product.id}`} className="text-[11px] font-bold text-slate-650 cursor-pointer">Disponível em Estoque</label>
                      </div>

                      <div className="border-t border-slate-200 pt-2 space-y-1">
                        <ImageUploadPicker
                          label="Trocar Foto da Vitrine"
                          value={editImage}
                          onChange={setEditImage}
                        />
                      </div>
                    </div>

                    <div className="flex gap-1.5 pt-2 border-t border-slate-200 mt-2 shrink-0">
                      <button
                        type="button"
                        onClick={() => setEditingId(null)}
                        className="flex-1 h-8 bg-slate-100 hover:bg-slate-200 text-slate-700 text-[10px] font-bold rounded-lg cursor-pointer"
                      >
                        Cancelar
                      </button>
                      <button
                        type="button"
                        onClick={() => saveEdit(product.id)}
                        className="flex-1 h-8 bg-blue-600 hover:bg-blue-700 text-white text-[10px] font-bold rounded-lg flex items-center justify-center gap-1 cursor-pointer shadow-3xs"
                      >
                        <Check className="w-3 h-3" /> Salvar Item
                      </button>
                    </div>
                  </div>
                )}

              </motion.div>
            );
          })}
        </AnimatePresence>

        {filteredProducts.length === 0 && (
          <div className="sm:col-span-2 lg:col-span-4 py-12 text-center bg-white border border-dashed border-natural-border rounded-3xl" id="no-products-view">
            <ShoppingBag className="w-8 h-8 text-slate-300 mx-auto mb-2" />
            <p className="text-xs font-bold text-slate-500">Nenhum produto cadastrado nesta categoria.</p>
            <p className="text-[11px] text-slate-400 mt-0.5">Explore outras abas ou mude de categoria acima.</p>
          </div>
        )}
      </div>

      {/* 🏡 COMPRA RAPIDA & CHECKOUT DIALOG MODAL */}
      <AnimatePresence>
        {buyingProduct && (
          <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn" id="shop-interactive-modal">
            
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-3xl border border-natural-border shadow-2xl max-w-2xl w-full overflow-hidden flex flex-col md:flex-row relative"
            >
              
              {/* Force exit button */}
              <button
                onClick={() => setBuyingProduct(null)}
                className="absolute top-4 right-4 z-20 p-1.5 rounded-full bg-black/40 hover:bg-black/60 text-white transition-colors cursor-pointer outline-none focus:outline-none"
                title="Fechar Janela"
              >
                <X className="w-4 h-4" />
              </button>

              {/* Lado Esquerdo - Detalhes do Produto */}
              <div className="md:w-5/12 bg-[#FAF9F6] border-b md:border-b-0 md:border-r border-natural-border relative flex flex-col">
                <div className="relative aspect-square md:aspect-auto md:flex-1 overflow-hidden bg-slate-100">
                  <img
                    src={buyingProduct.image}
                    alt={buyingProduct.title}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" />
                  
                  <div className="absolute bottom-4 left-4 right-4 text-white">
                    <span className="text-[9px] font-black uppercase tracking-wider bg-natural-primary px-2 py-0.5 rounded-md mb-1 inline-block">
                      {buyingProduct.category}
                    </span>
                    <h4 className="text-sm font-extrabold font-display leading-tight line-clamp-2">
                      {buyingProduct.title}
                    </h4>
                  </div>
                </div>

                <div className="p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-slate-400 uppercase font-mono font-bold">Valor do Item</span>
                    <span className="text-base font-mono font-black text-natural-primary">
                      {buyingProduct.price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-500 leading-relaxed max-h-[80px] overflow-y-auto pr-1">
                    {buyingProduct.description}
                  </p>
                  <div className="bg-amber-50/50 p-2.5 rounded-xl border border-amber-200/40 text-[9.5px] leading-relaxed text-amber-900 font-sans mt-1">
                    💝 <strong>Propósito Nobre:</strong> Ao comprar, você cobre os insumos e gera recurso direcionado exclusivamente para a reabilitação continuada do Gabriel.
                  </div>
                </div>
              </div>

              {/* Lado Direito - Formulário de Entrega & WhatsApp Checkout */}
              <div className="md:w-7/12 p-5 sm:p-6 space-y-4 flex flex-col justify-between">
                
                {!isOrderSubmitted ? (
                  <form onSubmit={handleOrderCheckout} className="space-y-4 flex-1">
                    <div>
                      <h4 className="font-serif italic font-bold text-natural-dark text-[15px] sm:text-base border-b border-natural-border/60 pb-2 flex items-center gap-1.5">
                        <ShoppingBag className="w-4 h-4 text-natural-primary" />
                        Formulário de Apoio
                      </h4>
                      <p className="text-[10px] text-slate-500 leading-normal mt-1">
                        Preencha o endereço de envio e os dados para organizarmos a entrega segura ou entrega sob agendamento.
                      </p>
                    </div>

                    {/* Variação (Se houver) */}
                    {buyingProduct.options && buyingProduct.options.length > 0 && (
                      <div className="space-y-1.5">
                        <label className="block text-[10.5px] font-extrabold text-[#444430]">
                          Selecione o(a) {buyingProduct.optionsLabel || 'Opção'}:
                        </label>
                        <div className="flex flex-wrap gap-1.5">
                          {buyingProduct.options.map(opt => (
                            <button
                              key={opt}
                              type="button"
                              onClick={() => setSelectedOption(opt)}
                              className={`px-2.5 h-7 rounded-lg text-[10.5px] font-semibold transition-all border outline-none cursor-pointer ${
                                selectedOption === opt
                                  ? 'bg-natural-primary border-natural-primary text-white scale-[1.02]'
                                  : 'bg-white border-slate-200 text-slate-650 hover:bg-slate-50'
                              }`}
                            >
                              {opt}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="space-y-2.5">
                      <div>
                        <label className="block text-[10px] font-bold text-slate-650 mb-0.5">Seu Nome Completo</label>
                        <input
                          type="text"
                          required
                          className="w-full h-8 px-2.5 bg-slate-50 border border-natural-border rounded-lg text-xs outline-none focus:border-natural-primary"
                          placeholder="Ex: Clara Maria Dias"
                          value={buyerName}
                          onChange={(e) => setBuyerName(e.target.value)}
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold text-slate-650 mb-0.5">Seu Número do WhatsApp / Celular</label>
                        <input
                          type="tel"
                          required
                          className="w-full h-8 px-2.5 bg-slate-50 border border-natural-border rounded-lg text-xs outline-none focus:border-natural-primary"
                          placeholder="Ex: (51) 99999-9999"
                          value={buyerPhone}
                          onChange={(e) => setBuyerPhone(e.target.value)}
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold text-slate-650 mb-0.5">Endereço de Entrega Completo</label>
                        <textarea
                          rows={2.5}
                          required
                          className="w-full p-2.5 bg-slate-50 border border-natural-border rounded-lg text-xs outline-none focus:border-natural-primary leading-relaxed text-slate-650"
                          placeholder="Rua, número, complemento, bairro, cidade, CEP..."
                          value={deliveryAddress}
                          onChange={(e) => setDeliveryAddress(e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="pt-2 flex flex-col gap-2">
                      <button
                        type="submit"
                        className="w-full h-10 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-all outline-none cursor-pointer uppercase tracking-wide shadow-sm"
                      >
                        <Send className="w-4 h-4" />
                        Finalizar e Enviar via WhatsApp
                      </button>

                      {buyingProduct.paymentLink && (
                        <a
                          href={buyingProduct.paymentLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-full h-10 bg-natural-primary hover:bg-natural-primary-dark text-white font-extrabold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-all outline-none cursor-pointer uppercase tracking-wide shadow-sm"
                          title="Fazer pagamento oficial integrado"
                        >
                          <DollarSign className="w-4 h-4" />
                          Ir para Pagamento Oficial (Cartão/PIX)
                        </a>
                      )}
                    </div>
                  </form>
                ) : (
                  <div className="flex flex-col items-center justify-center text-center p-6 space-y-4 my-auto">
                    <div className="p-3.5 bg-emerald-100 rounded-full text-emerald-600 animate-bounce">
                      <CheckCircle2 className="w-8 h-8" />
                    </div>
                    <div className="space-y-1">
                      <h4 className="font-serif italic font-bold text-natural-dark text-base">Ficha de Intenção Gerada!</h4>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        Os dados do seu pedido foram copiados e o WhatsApp foi aberto.
                      </p>
                      <p className="text-[11px] text-slate-500 max-w-xs mx-auto">
                        Mande a mensagem que preenchemos no chat do WhatsApp com a Fernanda Moraes Matos para registrar o envio e acertar o frete.
                      </p>
                    </div>

                    {buyingProduct.paymentLink && (
                      <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-left space-y-2 w-full">
                        <span className="text-[10px] font-bold text-[#444430] uppercase block">Dica de Pagamento Instantâneo</span>
                        <p className="text-[10px] text-slate-500 leading-normal">
                          Se você ainda não efetuou o pagamento do produto, você pode utilizar o link seguro da campanha abaixo:
                        </p>
                        <a
                          href={buyingProduct.paymentLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="h-8 w-full bg-natural-primary hover:bg-natural-primary-dark text-white font-extrabold text-[10.5px] rounded-lg flex items-center justify-center gap-1 cursor-pointer transition-colors"
                        >
                          <DollarSign className="w-3.5 h-3.5" /> Efetuar Pagamento do Item
                        </a>
                      </div>
                    )}

                    <button
                      onClick={() => setBuyingProduct(null)}
                      className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-colors cursor-pointer outline-none focus:outline-none"
                    >
                      Voltar para a Lojinha
                    </button>
                  </div>
                )}
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
