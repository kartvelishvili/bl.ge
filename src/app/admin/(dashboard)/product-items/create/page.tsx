"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAdminAuth } from "@/lib/admin-auth";

type Lang = "ge" | "en" | "ru";
type LocaleField = { en: string; ge: string; ru: string };

interface SelectOption {
  id: number;
  name: LocaleField | string;
}

interface ProductCategory {
  id: number;
  name: LocaleField;
  productId: number;
}

interface Food {
  id: number;
  name: LocaleField;
}

const emptyLocale = (): LocaleField => ({ en: "", ge: "", ru: "" });
const GLASS_OPTIONS = ["wine", "burgundy", "cordial", "champagne", "cognac"];
const LANGS: Lang[] = ["ge", "en", "ru"];

export default function CreateProductItemPage() {
  const router = useRouter();
  const { ready, authFetch } = useAdminAuth();
  const [tabLang, setTabLang] = useState<Lang>("ge");
  const [saving, setSaving] = useState(false);

  // Form fields
  const [name, setName] = useState<LocaleField>(emptyLocale());
  const [description, setDescription] = useState<LocaleField>(emptyLocale());
  const [color, setColor] = useState<LocaleField>(emptyLocale());
  const [volume, setVolume] = useState<LocaleField>(emptyLocale());
  const [composition, setComposition] = useState<LocaleField>(emptyLocale());
  const [viticulture, setViticulture] = useState<LocaleField>(emptyLocale());
  const [aged, setAged] = useState<LocaleField>(emptyLocale());

  const [alcohol, setAlcohol] = useState<number>(0);
  const [fruitTones, setFruitTones] = useState<number>(0);
  const [tannins, setTannins] = useState<number>(0);
  const [sweetness, setSweetness] = useState<number>(0);
  const [body, setBody] = useState<number>(0);
  const [temperature, setTemperature] = useState("");
  const [glass, setGlass] = useState("wine");
  const [isPopular, setIsPopular] = useState(false);

  // Selects
  const [products, setProducts] = useState<SelectOption[]>([]);
  const [selectedProductId, setSelectedProductId] = useState<string>("");
  const [categories, setCategories] = useState<ProductCategory[]>([]);
  const [productCategoryId, setProductCategoryId] = useState<string>("");
  const [companies, setCompanies] = useState<SelectOption[]>([]);
  const [companyId, setCompanyId] = useState<string>("");
  const [allFoods, setAllFoods] = useState<Food[]>([]);
  const [foodIds, setFoodIds] = useState<number[]>([]);

  // Files
  const [imageId, setImageId] = useState<number | null>(null);
  const [imagePreview, setImagePreview] = useState("");
  const [vinificationId, setVinificationId] = useState<number | null>(null);
  const [vinificationPreview, setVinificationPreview] = useState("");
  const [awardIds, setAwardIds] = useState<number[]>([]);
  const [awardPreviews, setAwardPreviews] = useState<string[]>([]);
  const [imageIds, setImageIds] = useState<number[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);

  const fetchData = useCallback(async () => {
    try {
      const [prodRes, compRes, foodRes] = await Promise.all([
        authFetch("/api/products"),
        authFetch("/api/companies"),
        authFetch("/api/foods"),
      ]);
      const [prodData, compData, foodData] = await Promise.all([
        prodRes.json(),
        compRes.json(),
        foodRes.json(),
      ]);
      setProducts(Array.isArray(prodData) ? prodData : []);
      setCompanies(Array.isArray(compData) ? compData : []);
      setAllFoods(Array.isArray(foodData) ? foodData : []);
    } catch {
      /* ignore */
    }
  }, [authFetch]);

  const fetchCategories = useCallback(async () => {
    if (!selectedProductId) {
      setCategories([]);
      return;
    }
    try {
      const res = await authFetch(`/api/product-category?productId=${selectedProductId}`);
      const data = await res.json();
      setCategories(Array.isArray(data) ? data : []);
    } catch {
      /* ignore */
    }
  }, [authFetch, selectedProductId]);

  useEffect(() => {
    if (ready) fetchData();
  }, [ready, fetchData]);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const uploadFile = async (file: File): Promise<{ id: number; url: string }[]> => {
    const fd = new FormData();
    fd.append("files", file);
    const res = await authFetch("/api/storage/upload-image", { method: "POST", body: fd });
    return res.json();
  };

  const handleSingleUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    setId: (id: number | null) => void,
    setPreview: (url: string) => void,
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const uploaded = await uploadFile(file);
    if (uploaded.length > 0) {
      setId(uploaded[0].id);
      setPreview(uploaded[0].url);
    }
  };

  const handleMultiUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    setIds: React.Dispatch<React.SetStateAction<number[]>>,
    setPreviews: React.Dispatch<React.SetStateAction<string[]>>,
  ) => {
    const files = e.target.files;
    if (!files) return;
    for (const file of Array.from(files)) {
      const uploaded = await uploadFile(file);
      if (uploaded.length > 0) {
        setIds((prev) => [...prev, uploaded[0].id]);
        setPreviews((prev) => [...prev, uploaded[0].url]);
      }
    }
  };

  const toggleFood = (id: number) => {
    setFoodIds((prev) => (prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id]));
  };

  const handleSubmit = async () => {
    setSaving(true);
    try {
      const payload = {
        name,
        description,
        color,
        volume,
        composition,
        viticulture,
        aged,
        alcohol,
        fruitTones,
        tannins,
        sweetness,
        body,
        temperature,
        glass,
        isPopular,
        productCategoryId: productCategoryId ? Number(productCategoryId) : null,
        companyId: companyId ? Number(companyId) : null,
        imageId,
        vinificationId,
        foodIds,
        awardIds,
        imageIds,
      };

      await authFetch("/api/product-items", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      router.push("/admin/product-items");
    } catch {
      alert("შეცდომა შენახვისას");
    } finally {
      setSaving(false);
    }
  };

  if (!ready) return null;

  const localeInput = (
    label: string,
    value: LocaleField,
    setValue: (v: LocaleField) => void,
    textarea = false,
  ) => (
    <div className="mb-3">
      <label className="block text-gray-300 text-sm mb-1">
        {label} ({tabLang})
      </label>
      {textarea ? (
        <textarea
          value={value[tabLang]}
          onChange={(e) => setValue({ ...value, [tabLang]: e.target.value })}
          rows={3}
          className="w-full px-3 py-2 bg-[#0f1420] border border-[#C9A84C]/20 rounded-lg text-white text-sm focus:outline-none focus:border-[#C9A84C]/50"
        />
      ) : (
        <input
          type="text"
          value={value[tabLang]}
          onChange={(e) => setValue({ ...value, [tabLang]: e.target.value })}
          className="w-full px-3 py-2 bg-[#0f1420] border border-[#C9A84C]/20 rounded-lg text-white text-sm focus:outline-none focus:border-[#C9A84C]/50"
        />
      )}
    </div>
  );

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1
          className="text-2xl text-[#C9A84C]"
          style={{ fontFamily: '"BPG WEB 002 Caps", sans-serif' }}
        >ახალი სასმელი</h1>
        <button
          onClick={() => router.push("/admin/product-items")}
          className="px-4 py-2.5 border border-[#C9A84C]/30 text-[#C9A84C] hover:bg-[#C9A84C]/10 rounded-lg text-sm transition-colors"
        >
          ← უკან
        </button>
      </div>

      <div className="bg-[#0f1420] rounded-lg border border-[#C9A84C]/10 p-6 max-w-4xl">
        {/* Language Tabs */}
        <div className="flex gap-1 mb-6">
          {LANGS.map((l) => (
            <button
              key={l}
              onClick={() => setTabLang(l)}
              className={`px-4 py-2 rounded text-sm font-medium ${
                tabLang === l ? "bg-[#C9A84C] text-[#0a0e17]" : "bg-[#0f1420] text-gray-400 border border-[#C9A84C]/20"
              }`}
            >
              {l.toUpperCase()}
            </button>
          ))}
        </div>

        {/* Localized fields */}
        {localeInput("სახელი", name, setName)}
        {localeInput("აღწერა", description, setDescription, true)}
        {localeInput("ფერი", color, setColor)}
        {localeInput("მოცულობა", volume, setVolume)}
        {localeInput("შემადგენლობა", composition, setComposition)}
        {localeInput("მევენახეობა", viticulture, setViticulture, true)}
        {localeInput("დაძველება", aged, setAged)}

        <hr className="border-[#C9A84C]/10 my-6" />

        {/* Number fields */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
          <div>
            <label className="block text-gray-300 text-sm mb-1">ალკოჰოლი %</label>
            <input
              type="number"
              step="0.1"
              value={alcohol}
              onChange={(e) => setAlcohol(parseFloat(e.target.value) || 0)}
              className="w-full px-3 py-2 bg-[#0f1420] border border-[#C9A84C]/20 rounded-lg text-white text-sm focus:outline-none focus:border-[#C9A84C]/50"
            />
          </div>
          <div>
            <label className="block text-gray-300 text-sm mb-1">ხილის ტონები</label>
            <input
              type="number"
              value={fruitTones}
              onChange={(e) => setFruitTones(parseInt(e.target.value) || 0)}
              className="w-full px-3 py-2 bg-[#0f1420] border border-[#C9A84C]/20 rounded-lg text-white text-sm focus:outline-none focus:border-[#C9A84C]/50"
            />
          </div>
          <div>
            <label className="block text-gray-300 text-sm mb-1">ტანინები</label>
            <input
              type="number"
              value={tannins}
              onChange={(e) => setTannins(parseInt(e.target.value) || 0)}
              className="w-full px-3 py-2 bg-[#0f1420] border border-[#C9A84C]/20 rounded-lg text-white text-sm focus:outline-none focus:border-[#C9A84C]/50"
            />
          </div>
          <div>
            <label className="block text-gray-300 text-sm mb-1">სიტკბო</label>
            <input
              type="number"
              value={sweetness}
              onChange={(e) => setSweetness(parseInt(e.target.value) || 0)}
              className="w-full px-3 py-2 bg-[#0f1420] border border-[#C9A84C]/20 rounded-lg text-white text-sm focus:outline-none focus:border-[#C9A84C]/50"
            />
          </div>
          <div>
            <label className="block text-gray-300 text-sm mb-1">სხეული</label>
            <input
              type="number"
              value={body}
              onChange={(e) => setBody(parseInt(e.target.value) || 0)}
              className="w-full px-3 py-2 bg-[#0f1420] border border-[#C9A84C]/20 rounded-lg text-white text-sm focus:outline-none focus:border-[#C9A84C]/50"
            />
          </div>
          <div>
            <label className="block text-gray-300 text-sm mb-1">ტემპერატურა</label>
            <input
              type="text"
              value={temperature}
              onChange={(e) => setTemperature(e.target.value)}
              className="w-full px-3 py-2 bg-[#0f1420] border border-[#C9A84C]/20 rounded-lg text-white text-sm focus:outline-none focus:border-[#C9A84C]/50"
            />
          </div>
        </div>

        <hr className="border-[#C9A84C]/10 my-6" />

        {/* Selects */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-gray-300 text-sm mb-1">პროდუქცია</label>
            <select
              value={selectedProductId}
              onChange={(e) => {
                setSelectedProductId(e.target.value);
                setProductCategoryId("");
              }}
              className="w-full px-3 py-2 bg-[#0f1420] border border-[#C9A84C]/20 rounded-lg text-white text-sm focus:outline-none focus:border-[#C9A84C]/50"
            >
              <option value="">აირჩიეთ...</option>
              {products.map((p) => (
                <option key={p.id} value={p.id}>
                  {typeof p.name === "string" ? p.name : p.name?.ge || p.name?.en}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-gray-300 text-sm mb-1">კატეგორია</label>
            <select
              value={productCategoryId}
              onChange={(e) => setProductCategoryId(e.target.value)}
              className="w-full px-3 py-2 bg-[#0f1420] border border-[#C9A84C]/20 rounded-lg text-white text-sm focus:outline-none focus:border-[#C9A84C]/50"
            >
              <option value="">აირჩიეთ...</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name?.ge || c.name?.en}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-gray-300 text-sm mb-1">სავაჭრო ნიშანი</label>
            <select
              value={companyId}
              onChange={(e) => setCompanyId(e.target.value)}
              className="w-full px-3 py-2 bg-[#0f1420] border border-[#C9A84C]/20 rounded-lg text-white text-sm focus:outline-none focus:border-[#C9A84C]/50"
            >
              <option value="">აირჩიეთ...</option>
              {companies.map((c) => (
                <option key={c.id} value={c.id}>
                  {typeof c.name === "string" ? c.name : c.name?.ge}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-gray-300 text-sm mb-1">ჭიქა</label>
            <select
              value={glass}
              onChange={(e) => setGlass(e.target.value)}
              className="w-full px-3 py-2 bg-[#0f1420] border border-[#C9A84C]/20 rounded-lg text-white text-sm focus:outline-none focus:border-[#C9A84C]/50"
            >
              {GLASS_OPTIONS.map((g) => (
                <option key={g} value={g}>
                  {g}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Popular */}
        <div className="mb-4 flex items-center gap-2">
          <input
            type="checkbox"
            checked={isPopular}
            onChange={(e) => setIsPopular(e.target.checked)}
            className="rounded bg-[#0f1420] border-[#C9A84C]/20"
          />
          <label className="text-gray-300 text-sm">პოპულარული</label>
        </div>

        <hr className="border-[#C9A84C]/10 my-6" />

        {/* Foods multi-select */}
        <div className="mb-4">
          <label className="block text-gray-300 text-sm mb-2">კერძები</label>
          <div className="flex flex-wrap gap-2">
            {allFoods.map((f) => (
              <button
                key={f.id}
                type="button"
                onClick={() => toggleFood(f.id)}
                className={`px-3 py-1.5 rounded text-xs font-medium ${
                  foodIds.includes(f.id)
                    ? "bg-[#C9A84C] text-[#0a0e17]"
                    : "bg-[#0f1420] text-gray-300 hover:bg-[#C9A84C]/10"
                }`}
              >
                {f.name?.ge || f.name?.en}
              </button>
            ))}
          </div>
        </div>

        <hr className="border-[#C9A84C]/10 my-6" />

        {/* File Uploads */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-gray-300 text-sm mb-1">მთავარი სურათი</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleSingleUpload(e, setImageId, setImagePreview)}
              className="text-sm text-gray-400 file:mr-2 file:py-1 file:px-3 file:rounded file:border-0 file:bg-[#C9A84C]/20 file:text-white file:cursor-pointer"
            />
            {imagePreview && (
              <img src={imagePreview} alt="" className="mt-2 h-20 rounded object-cover" />
            )}
          </div>
          <div>
            <label className="block text-gray-300 text-sm mb-1">ვინიფიკაციის სურათი</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleSingleUpload(e, setVinificationId, setVinificationPreview)}
              className="text-sm text-gray-400 file:mr-2 file:py-1 file:px-3 file:rounded file:border-0 file:bg-[#C9A84C]/20 file:text-white file:cursor-pointer"
            />
            {vinificationPreview && (
              <img src={vinificationPreview} alt="" className="mt-2 h-20 rounded object-cover" />
            )}
          </div>
        </div>

        {/* Awards */}
        <div className="mb-4">
          <label className="block text-gray-300 text-sm mb-1">ჯილდოები</label>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={(e) => handleMultiUpload(e, setAwardIds, setAwardPreviews)}
            className="text-sm text-gray-400 file:mr-2 file:py-1 file:px-3 file:rounded file:border-0 file:bg-[#C9A84C]/20 file:text-white file:cursor-pointer"
          />
          {awardPreviews.length > 0 && (
            <div className="flex gap-2 mt-2 flex-wrap">
              {awardPreviews.map((url, i) => (
                <div key={i} className="relative">
                  <img src={url} alt="" className="h-16 rounded object-cover" />
                  <button
                    type="button"
                    onClick={() => {
                      setAwardIds((p) => p.filter((_, j) => j !== i));
                      setAwardPreviews((p) => p.filter((_, j) => j !== i));
                    }}
                    className="absolute -top-1 -right-1 w-5 h-5 bg-red-600 text-white rounded-full text-xs flex items-center justify-center"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Gallery images */}
        <div className="mb-6">
          <label className="block text-gray-300 text-sm mb-1">გალერეა</label>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={(e) => handleMultiUpload(e, setImageIds, setImagePreviews)}
            className="text-sm text-gray-400 file:mr-2 file:py-1 file:px-3 file:rounded file:border-0 file:bg-[#C9A84C]/20 file:text-white file:cursor-pointer"
          />
          {imagePreviews.length > 0 && (
            <div className="flex gap-2 mt-2 flex-wrap">
              {imagePreviews.map((url, i) => (
                <div key={i} className="relative">
                  <img src={url} alt="" className="h-16 rounded object-cover" />
                  <button
                    type="button"
                    onClick={() => {
                      setImageIds((p) => p.filter((_, j) => j !== i));
                      setImagePreviews((p) => p.filter((_, j) => j !== i));
                    }}
                    className="absolute -top-1 -right-1 w-5 h-5 bg-red-600 text-white rounded-full text-xs flex items-center justify-center"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Submit */}
        <div className="flex justify-end gap-2">
          <button
            onClick={() => router.push("/admin/product-items")}
            className="px-4 py-2 border border-[#C9A84C]/30 text-[#C9A84C] hover:bg-[#C9A84C]/10 rounded-lg text-sm transition-colors"
          >
            გაუქმება
          </button>
          <button
            onClick={handleSubmit}
            disabled={saving}
            className="px-6 py-2 bg-[#C9A84C] hover:bg-[#d4b65e] text-[#0a0e17] rounded-lg text-sm font-medium disabled:opacity-50 transition-colors"
          >
            {saving ? "ინახება..." : "შენახვა"}
          </button>
        </div>
      </div>
    </div>
  );
}
