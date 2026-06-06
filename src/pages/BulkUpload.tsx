import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Upload, FileText, AlertCircle, CheckCircle2, Loader2, X, Download } from "lucide-react";
import { useApp } from "../context/AppContext";
import { zernioApi, type CreatePostBody } from "../services/api";

interface ParsedRow {
  content: string;
  platforms: string[];
  scheduled_for: string;
  hashtags: string[];
  error?: string;
}

interface UploadResult {
  index: number;
  ok: boolean;
  error?: string;
}

function parseCSV(text: string): string[][] {
  const rows: string[][] = [];
  const lines = text.split(/\r?\n/).filter((l) => l.trim());
  for (const line of lines) {
    const cells: string[] = [];
    let i = 0;
    while (i < line.length) {
      if (line[i] === '"') {
        let cell = "";
        i++;
        while (i < line.length) {
          if (line[i] === '"' && line[i + 1] === '"') { cell += '"'; i += 2; }
          else if (line[i] === '"') { i++; break; }
          else { cell += line[i++]; }
        }
        cells.push(cell);
        if (line[i] === ",") i++;
      } else {
        const end = line.indexOf(",", i);
        if (end === -1) { cells.push(line.slice(i).trim()); break; }
        cells.push(line.slice(i, end).trim());
        i = end + 1;
      }
    }
    rows.push(cells);
  }
  return rows;
}

const SAMPLE_CSV = `content,platforms,scheduled_for,hashtags
"Excited to share our latest update! Check it out.","instagram,facebook","2026-06-20 10:00","#product #launch"
"Behind the scenes of our team this week.","twitter","2026-06-21 09:00","#team #bts"
"5 tips to boost your social media engagement.","linkedin,instagram","2026-06-22 14:00","#tips #socialmedia"`;

export default function BulkUpload() {
  const { accounts } = useApp();
  const navigate = useNavigate();
  const fileRef = useRef<HTMLInputElement>(null);
  const [rows, setRows] = useState<ParsedRow[]>([]);
  const [fileName, setFileName] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [results, setResults] = useState<UploadResult[]>([]);
  const [done, setDone] = useState(false);

  const platformToAccountId = (platformName: string) => {
    const acc = accounts.find((a) => a.platform.toLowerCase() === platformName.toLowerCase().trim());
    return acc?._id ?? null;
  };

  function handleFile(file: File) {
    setFileName(file.name);
    setResults([]);
    setDone(false);
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      const allRows = parseCSV(text);
      if (allRows.length < 2) { setRows([]); return; }
      const header = allRows[0].map((h) => h.toLowerCase().trim());
      const ci = header.indexOf("content");
      const pi = header.indexOf("platforms");
      const si = header.indexOf("scheduled_for");
      const hi = header.indexOf("hashtags");

      const parsed: ParsedRow[] = allRows.slice(1).map((cells) => {
        const content = ci >= 0 ? (cells[ci] ?? "").trim() : "";
        const platformRaw = pi >= 0 ? (cells[pi] ?? "") : "";
        const platforms = platformRaw.split(",").map((p) => p.trim()).filter(Boolean);
        const scheduled_for = si >= 0 ? (cells[si] ?? "").trim() : "";
        const hashtagRaw = hi >= 0 ? (cells[hi] ?? "") : "";
        const hashtags = hashtagRaw.split(/[\s,]+/).map((t) => t.replace(/^#/, "")).filter(Boolean);

        let error: string | undefined;
        if (!content) error = "Content is required";
        else if (platforms.length === 0) error = "At least one platform required";
        else if (!scheduled_for) error = "scheduled_for is required";
        else if (isNaN(Date.parse(scheduled_for))) error = "Invalid date format";
        else if (new Date(scheduled_for) <= new Date()) error = "Date must be in the future";
        else {
          const missing = platforms.filter((p) => !platformToAccountId(p));
          if (missing.length) error = `No connected account for: ${missing.join(", ")}`;
        }

        return { content, platforms, scheduled_for, hashtags, error };
      });

      setRows(parsed);
    };
    reader.readAsText(file);
  }

  async function handleSubmit() {
    const valid = rows.filter((r) => !r.error);
    if (!valid.length) return;
    setSubmitting(true);
    const res: UploadResult[] = [];

    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];
      if (row.error) { res.push({ index: i, ok: false, error: row.error }); continue; }

      const platforms = row.platforms
        .map((p) => ({ platform: p.toLowerCase(), accountId: platformToAccountId(p)! }))
        .filter((p) => p.accountId);

      const body: CreatePostBody = {
        content: row.content,
        platforms,
        scheduledFor: new Date(row.scheduled_for).toISOString(),
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        ...(row.hashtags.length > 0 && { hashtags: row.hashtags }),
      };

      try {
        await zernioApi.posts.create(body);
        res.push({ index: i, ok: true });
      } catch (err) {
        res.push({ index: i, ok: false, error: err instanceof Error ? err.message : "Failed" });
      }
    }

    setResults(res);
    setSubmitting(false);
    setDone(true);
  }

  const validCount = rows.filter((r) => !r.error).length;
  const errorCount = rows.filter((r) => r.error).length;
  const successCount = results.filter((r) => r.ok).length;

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Bulk Upload</h1>
          <p className="text-sm text-gray-500 mt-0.5">Schedule multiple posts at once by uploading a CSV file</p>
        </div>
        <button
          onClick={() => {
            const blob = new Blob([SAMPLE_CSV], { type: "text/csv" });
            const a = document.createElement("a");
            a.href = URL.createObjectURL(blob);
            a.download = "postify-bulk-template.csv";
            a.click();
          }}
          className="flex items-center gap-2 text-sm text-gray-600 border border-gray-200 hover:border-gray-400 px-4 py-2 rounded-lg transition-colors shrink-0">
          <Download className="size-4" /> Download template
        </button>
      </div>

      {/* CSV format reference */}
      <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
        <p className="text-xs font-semibold text-gray-600 mb-2 uppercase tracking-wide">Expected columns</p>
        <div className="grid grid-cols-2 gap-2 text-xs text-gray-600">
          <div><span className="font-mono bg-white border border-gray-200 px-1.5 py-0.5 rounded text-gray-800">content</span> <span className="text-gray-400">— post text (required)</span></div>
          <div><span className="font-mono bg-white border border-gray-200 px-1.5 py-0.5 rounded text-gray-800">platforms</span> <span className="text-gray-400">— comma-separated (required)</span></div>
          <div><span className="font-mono bg-white border border-gray-200 px-1.5 py-0.5 rounded text-gray-800">scheduled_for</span> <span className="text-gray-400">— YYYY-MM-DD HH:MM (required)</span></div>
          <div><span className="font-mono bg-white border border-gray-200 px-1.5 py-0.5 rounded text-gray-800">hashtags</span> <span className="text-gray-400">— space/comma-separated (optional)</span></div>
        </div>
      </div>

      {/* Drop zone */}
      <div
        className="border-2 border-dashed border-gray-200 rounded-xl py-12 flex flex-col items-center gap-3 text-gray-400 hover:border-gray-400 transition-colors cursor-pointer"
        onClick={() => fileRef.current?.click()}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => { e.preventDefault(); const f = e.dataTransfer.files[0]; if (f) handleFile(f); }}>
        <Upload className="size-8" />
        <div className="text-center">
          <p className="text-sm font-medium text-gray-600">{fileName || "Drop your CSV here or click to browse"}</p>
          <p className="text-xs mt-0.5">CSV files only</p>
        </div>
        <input ref={fileRef} type="file" accept=".csv,text/csv" className="hidden"
          onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); }} />
      </div>

      {/* Preview table */}
      {rows.length > 0 && !done && (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="flex items-center justify-between px-5 py-3 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <FileText className="size-4 text-gray-400" />
              <span className="text-sm font-semibold text-gray-900">{rows.length} rows detected</span>
            </div>
            <div className="flex items-center gap-3 text-xs">
              {validCount > 0 && <span className="text-green-600 font-medium">{validCount} valid</span>}
              {errorCount > 0 && <span className="text-red-500 font-medium">{errorCount} with errors</span>}
            </div>
          </div>
          <div className="divide-y divide-gray-50 max-h-80 overflow-y-auto">
            {rows.map((row, i) => (
              <div key={i} className={`px-5 py-3.5 flex items-start gap-3 ${row.error ? "bg-red-50/50" : ""}`}>
                <span className="text-xs font-mono text-gray-400 w-5 shrink-0 pt-0.5">{i + 1}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-800 line-clamp-1">{row.content || <span className="text-gray-400 italic">empty</span>}</p>
                  <div className="flex flex-wrap items-center gap-2 mt-1">
                    {row.platforms.map((p) => (
                      <span key={p} className="text-[10px] px-1.5 py-0.5 bg-gray-100 text-gray-600 rounded font-medium capitalize">{p}</span>
                    ))}
                    {row.scheduled_for && (
                      <span className="text-[10px] text-gray-400">{row.scheduled_for}</span>
                    )}
                  </div>
                  {row.error && (
                    <div className="flex items-center gap-1 mt-1">
                      <AlertCircle className="size-3 text-red-500 shrink-0" />
                      <p className="text-xs text-red-500">{row.error}</p>
                    </div>
                  )}
                </div>
                {row.error
                  ? <X className="size-4 text-red-400 shrink-0 mt-0.5" />
                  : <CheckCircle2 className="size-4 text-green-500 shrink-0 mt-0.5" />}
              </div>
            ))}
          </div>
          <div className="px-5 py-4 border-t border-gray-100 flex items-center justify-between gap-4">
            <p className="text-xs text-gray-400">
              {errorCount > 0 ? `${errorCount} rows with errors will be skipped.` : "All rows look good!"}
            </p>
            <button
              onClick={handleSubmit}
              disabled={submitting || validCount === 0}
              className="flex items-center gap-2 px-5 py-2.5 bg-gray-900 text-white text-sm font-semibold rounded-lg hover:bg-gray-800 disabled:opacity-50 transition-colors">
              {submitting
                ? <><Loader2 className="size-4 animate-spin" /> Scheduling…</>
                : <><Upload className="size-4" /> Schedule {validCount} post{validCount !== 1 ? "s" : ""}</>}
            </button>
          </div>
        </div>
      )}

      {/* Results */}
      {done && (
        <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
          <div className="flex items-center gap-3">
            <div className="size-10 rounded-xl bg-green-50 flex items-center justify-center">
              <CheckCircle2 className="size-5 text-green-600" />
            </div>
            <div>
              <p className="font-semibold text-gray-900">{successCount} of {rows.length} posts scheduled</p>
              {results.filter((r) => !r.ok).length > 0 && (
                <p className="text-xs text-gray-500 mt-0.5">{results.filter((r) => !r.ok).length} failed — see details below</p>
              )}
            </div>
          </div>
          {results.filter((r) => !r.ok).length > 0 && (
            <div className="space-y-2">
              {results.filter((r) => !r.ok).map((r) => (
                <div key={r.index} className="flex items-start gap-2 p-3 bg-red-50 rounded-lg">
                  <AlertCircle className="size-4 text-red-500 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs font-medium text-gray-700">Row {r.index + 1}</p>
                    <p className="text-xs text-red-600">{r.error}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
          <div className="flex gap-3">
            <button onClick={() => { setRows([]); setResults([]); setDone(false); setFileName(""); }}
              className="px-4 py-2 text-sm text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              Upload another
            </button>
            <button onClick={() => navigate("/posts")}
              className="px-4 py-2 text-sm font-semibold text-white bg-gray-900 rounded-lg hover:bg-gray-800 transition-colors">
              View posts →
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
