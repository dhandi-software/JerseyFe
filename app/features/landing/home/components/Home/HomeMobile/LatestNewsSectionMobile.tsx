import React from "react";
import { User, Calendar, MessageCircle, ArrowRight } from "lucide-react";
import { Link } from "react-router";
import type { NewsArticle } from "../HomeDesktop/LatestNewsSection";
import { HomeProductEmptyState } from "../HomeProductEmptyState";

const ARTICLES_LIST_MOBILE: NewsArticle[] = [];

export function LatestNewsSectionMobile() {
  if (ARTICLES_LIST_MOBILE.length === 0) {
    return (
      <section className="w-full my-6 space-y-3">
        <h2 className="text-lg font-bold text-gray-900 text-center">
          Berita & Artikel FCSV
        </h2>
        <HomeProductEmptyState
          compact
          title="Belum Ada Artikel Dipublikasikan"
          description="Admin belum mempublikasikan artikel atau tips seputar apparel olahraga dan jersey."
          actionText="Tentang FCSV"
          actionHref="/about"
        />
      </section>
    );
  }

  return (
    <section className="w-full my-6 space-y-4">
      <h2 className="text-lg font-bold text-gray-900 text-center">
        Berita & Artikel FCSV
      </h2>

      <div className="space-y-4">
        {ARTICLES_LIST_MOBILE.map((article) => (
          <article
            key={article.id}
            className="bg-white rounded-2xl border border-gray-200 p-4 flex flex-col justify-between shadow-2xs"
          >
            <div>
              <div className="w-full h-44 rounded-xl overflow-hidden mb-3 bg-gray-100">
                <img
                  src={article.image}
                  alt={article.title}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="flex items-center gap-3 text-[11px] text-gray-500 font-medium mb-2">
                <div className="flex items-center gap-1">
                  <User className="w-3 h-3 text-[#FA8232]" />
                  <span>{article.author}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="w-3 h-3 text-[#FA8232]" />
                  <span>{article.date}</span>
                </div>
              </div>

              <h3 className="text-sm font-bold text-gray-900 line-clamp-2 leading-snug">
                {article.title}
              </h3>

              <p className="text-xs text-gray-500 line-clamp-2 mt-1.5 leading-relaxed">
                {article.excerpt}
              </p>
            </div>

            <Link
              to="/about"
              className="mt-4 border border-[#FA8232]/40 text-[#FA8232] hover:bg-[#FA8232] hover:text-white font-bold text-[11px] uppercase px-4 h-10 rounded-xl transition-all duration-200 inline-flex items-center justify-center gap-1.5 self-start cursor-pointer"
            >
              <span>BACA SELENGKAPNYA</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </article>
        ))}
      </div>
    </section>
  );
}

