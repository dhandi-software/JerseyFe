import React from "react";
import { User, Calendar, MessageCircle, ArrowRight } from "lucide-react";
import { Link } from "react-router";
import { HomeProductEmptyState } from "../HomeProductEmptyState";

export interface NewsArticle {
  id: string;
  title: string;
  excerpt: string;
  author: string;
  date: string;
  commentsCount: number;
  image: string;
}

const ARTICLES_LIST: NewsArticle[] = [];

export function LatestNewsSection() {
  if (ARTICLES_LIST.length === 0) {
    return (
      <section className="w-full my-12 space-y-4">
        <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 text-center">
          Berita & Artikel FCSV
        </h2>
        <HomeProductEmptyState
          title="Belum Ada Artikel Dipublikasikan"
          description="Admin belum mempublikasikan artikel atau tips seputar apparel olahraga dan jersey."
          actionText="Tentang FCSV"
          actionHref="/about"
        />
      </section>
    );
  }

  return (
    <section className="w-full my-12">
      <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 text-center mb-8">
        Berita & Artikel FCSV
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {ARTICLES_LIST.map((article) => (
          <article
            key={article.id}
            className="bg-white rounded-2xl border border-gray-200/80 p-5 flex flex-col justify-between hover:shadow-lg transition-all duration-300 group"
          >
            <div>
              <div className="w-full h-48 rounded-xl overflow-hidden mb-4 bg-gray-100">
                <img
                  src={article.image}
                  alt={article.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>

              <div className="flex items-center gap-4 text-xs text-gray-500 font-medium mb-3">
                <div className="flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-[#FA8232]" />
                  <span>{article.author}</span>
                </div>

                <div className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-[#FA8232]" />
                  <span>{article.date}</span>
                </div>

                <div className="flex items-center gap-1.5">
                  <MessageCircle className="w-3.5 h-3.5 text-[#FA8232]" />
                  <span>{article.commentsCount}</span>
                </div>
              </div>

              <h3 className="text-base lg:text-lg font-bold text-gray-900 line-clamp-2 leading-snug group-hover:text-[#FA8232] transition-colors">
                {article.title}
              </h3>

              <p className="text-xs text-gray-500 line-clamp-3 mt-2 leading-relaxed">
                {article.excerpt}
              </p>
            </div>

            <Link
              to="/about"
              className="mt-6 border border-[#FA8232]/40 text-[#FA8232] hover:bg-[#FA8232] hover:text-white font-bold text-xs uppercase px-5 py-2.5 rounded-xl transition-all duration-200 inline-flex items-center gap-2 self-start group/btn cursor-pointer"
            >
              <span>BACA SELENGKAPNYA</span>
              <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover/btn:translate-x-1" />
            </Link>
          </article>
        ))}
      </div>
    </section>
  );
}

