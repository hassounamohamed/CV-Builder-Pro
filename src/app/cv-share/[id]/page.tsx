"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { doc, getDoc } from "firebase/firestore";
import { db, isConfigured } from "@/lib/firebase";
import { CVData } from "@/types/cv";
import CVPreview from "@/components/common/cv/CVPreview";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/contexts/I18nContext";
import LanguageSwitcher from "@/components/common/language-switcher";
import ThemeToggle from "@/components/common/theme-toggle";

export default function SharedCVPage() {
  const { id } = useParams<{ id: string }>();
  const { t } = useI18n();
  const [isLoading, setIsLoading] = useState(true);
  const [cvData, setCvData] = useState<CVData | null>(null);

  useEffect(() => {
    const loadSharedCV = async () => {
      if (!id || !isConfigured || !db) {
        setCvData(null);
        setIsLoading(false);
        return;
      }

      try {
        const sharedDocRef = doc(db, "cvs", id);
        const sharedDocSnap = await getDoc(sharedDocRef);

        if (!sharedDocSnap.exists()) {
          setCvData(null);
          return;
        }

        const data = sharedDocSnap.data() as CVData & { isShared?: boolean };
        if (!data.isShared) {
          setCvData(null);
          return;
        }

        setCvData({
          ...data,
          projects: data.projects || [],
          languages: data.languages || [],
        });
      } catch (error) {
        console.error("Error loading shared CV:", error);
        setCvData(null);
      } finally {
        setIsLoading(false);
      }
    };

    loadSharedCV();
  }, [id]);

  if (isLoading) {
    return (
      <main className="min-h-screen bg-background text-foreground p-6">
        <div className="max-w-6xl mx-auto text-center py-20">{t("cv.share.loading")}</div>
      </main>
    );
  }

  if (!cvData) {
    return (
      <main className="min-h-screen bg-background text-foreground p-6">
        <div className="max-w-6xl mx-auto text-center py-20 space-y-4">
          <h1 className="text-2xl font-bold">{t("cv.share.notFound")}</h1>
          <Button asChild>
            <Link href="/">{t("cv.share.backHome")}</Link>
          </Button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background text-foreground p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-6 flex items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold">{t("cv.share.title")}</h1>
            <p className="text-muted-foreground">{t("cv.share.subtitle")}</p>
          </div>
          <div className="flex items-center gap-2">
            <LanguageSwitcher />
            <ThemeToggle />
          </div>
        </div>

        <div className="overflow-auto rounded-xl border border-border bg-muted p-4">
          <div className="mx-auto w-fit">
            <CVPreview cvData={cvData} />
          </div>
        </div>
      </div>
    </main>
  );
}
