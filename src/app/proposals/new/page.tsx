"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Sparkles,
  Save,
  Send,
  Eye,
  Plus,
  X,
  Bot,
  Check,
  RotateCcw,
} from "lucide-react";
import { AppShell, PageHeader } from "@/components/layout/app-shell";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { useRole } from "@/contexts/role-context";
import { CATEGORY_LABEL, CATEGORY_LIST } from "@/lib/constants";
import type { AiSuggestion, Category, NewProposalInput } from "@/lib/types";
import { getProvider } from "@/lib/repository";
import { cn } from "@/lib/utils";

const MAX_TITLE = 120;
const MAX_DESC = 4000;

export default function NewProposalPage() {
  const router = useRouter();
  const { user, role } = useRole();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState<Category>("transportation");
  const [tagInput, setTagInput] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [location, setLocation] = useState("");
  const [affectedCommunity, setAffectedCommunity] = useState("");
  const [aiSuggestions, setAiSuggestions] = useState<AiSuggestion[]>([]);
  const [generatingAi, setGeneratingAi] = useState(false);
  const [submitting, setSubmitting] = useState<"draft" | "submit" | null>(null);
  const [previewOpen, setPreviewOpen] = useState(false);

  const addTag = () => {
    const t = tagInput.trim().toLowerCase().replace(/^#/, "");
    if (t && !tags.includes(t) && tags.length < 6) {
      setTags([...tags, t]);
      setTagInput("");
    }
  };

  const removeTag = (t: string) => setTags(tags.filter((x) => x !== t));

  const handleAiSuggestions = async () => {
    setGeneratingAi(true);
    const res = await getProvider().suggestProposalImprovements({
      title,
      description,
      tags,
    });
    if (res.success && res.data) {
      setAiSuggestions(res.data);
      toast.success("AI suggestions generated", { description: "Deterministic mock — advisory only." });
    } else {
      toast.error("Could not generate suggestions");
    }
    setGeneratingAi(false);
  };

  const applySuggestion = (s: AiSuggestion) => {
    if (s.field === "title") setTitle(s.suggestedText);
    if (s.field === "description") setDescription((d) => (d ? `${d}\n\n${s.suggestedText}` : s.suggestedText));
    if (s.field === "tags") {
      const newTags = s.suggestedText.split(",").map((t) => t.trim().toLowerCase().replace(/^#/, "")).filter(Boolean);
      setTags(Array.from(new Set([...tags, ...newTags])).slice(0, 6));
    }
    setAiSuggestions((arr) => arr.map((x) => x.id === s.id ? { ...x, accepted: true } : x));
    toast.success("Suggestion applied");
  };

  const resetSuggestion = (s: AiSuggestion) => {
    setAiSuggestions((arr) => arr.map((x) => x.id === s.id ? { ...x, accepted: false } : x));
  };

  const validate = (): string | null => {
    if (title.trim().length < 10) return "Title must be at least 10 characters.";
    if (title.length > MAX_TITLE) return `Title must be at most ${MAX_TITLE} characters.`;
    if (description.trim().length < 50) return "Description must be at least 50 characters.";
    if (description.length > MAX_DESC) return `Description must be at most ${MAX_DESC} characters.`;
    if (tags.length === 0) return "Add at least one tag.";
    return null;
  };

  const submit = async (as: "draft" | "submit") => {
    const err = validate();
    if (err) {
      toast.error("Validation error", { description: err });
      return;
    }
    setSubmitting(as);
    const input: NewProposalInput = {
      title: title.trim(),
      description: description.trim(),
      category,
      tags,
      location: location.trim() || undefined,
      affectedCommunity: affectedCommunity.trim() || undefined,
    };
    const res = await getProvider().createProposal(input, user.id, user.displayName, role);
    if (!res.success || !res.data) {
      toast.error("Could not create proposal", { description: res.error?.message });
      setSubmitting(null);
      return;
    }
    if (as === "submit") {
      // Move draft → ai_review to mimic the lifecycle
      await getProvider().transitionProposal(res.data.id, "ai_review", user.id, user.displayName);
    }
    toast.success(as === "draft" ? "Draft saved" : "Proposal submitted", {
      description: as === "draft" ? "You can return to edit it later." : "Moved to AI Review stage.",
    });
    router.push(`/proposals/${res.data.id}`);
  };

  return (
    <AppShell>
      <div className="px-4 md:px-8 py-6 max-w-4xl mx-auto">
        <Link href="/proposals" className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground mb-4">
          <ArrowLeft className="h-3 w-3 rtl:rotate-180" /> Back to proposals
        </Link>

        <PageHeader
          title="New proposal"
          description="Draft a community proposal. Use the mock AI assistant to refine clarity and structure. Demo submissions are recorded in the audit trail."
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">Proposal details</CardTitle>
                <CardDescription className="text-xs">Be specific and measurable. Vague proposals are harder to verify.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title" className="text-xs">Title <span className="text-destructive">*</span></Label>
                  <Input
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value.slice(0, MAX_TITLE))}
                    placeholder="e.g. Expand Copenhagen's protected bike lanes on Nørrebrogade"
                    maxLength={MAX_TITLE}
                  />
                  <div className="text-[10px] text-muted-foreground text-right">{title.length}/{MAX_TITLE}</div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description" className="text-xs">Description <span className="text-destructive">*</span></Label>
                  <Textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value.slice(0, MAX_DESC))}
                    rows={10}
                    placeholder="Describe the problem, who is affected, the proposed intervention, expected outcomes, and estimated cost/timeline."
                    maxLength={MAX_DESC}
                  />
                  <div className="text-[10px] text-muted-foreground text-right">{description.length}/{MAX_DESC}</div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label htmlFor="category" className="text-xs">Category <span className="text-destructive">*</span></Label>
                    <Select value={category} onValueChange={(v) => setCategory(v as Category)}>
                      <SelectTrigger id="category" className="h-9"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {CATEGORY_LIST.map((c) => (
                          <SelectItem key={c} value={c}>{CATEGORY_LABEL[c]}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="location" className="text-xs">Location (optional)</Label>
                    <Input id="location" value={location} onChange={(e) => setLocation(e.target.value)} placeholder="e.g. Copenhagen, Denmark" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="affectedCommunity" className="text-xs">Affected community (optional)</Label>
                  <Input id="affectedCommunity" value={affectedCommunity} onChange={(e) => setAffectedCommunity(e.target.value)} placeholder="e.g. Daily cyclists, Nørrebro residents" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="tagInput" className="text-xs">Tags <span className="text-destructive">*</span></Label>
                  <div className="flex gap-2">
                    <Input
                      id="tagInput"
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addTag(); } }}
                      placeholder="cycling, safety, infrastructure..."
                      className="flex-1"
                    />
                    <Button type="button" size="sm" variant="outline" onClick={addTag} disabled={!tagInput.trim() || tags.length >= 6}>
                      <Plus className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                  {tags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {tags.map((t) => (
                        <Badge key={t} variant="secondary" className="text-xs gap-1 pr-1">
                          #{t}
                          <button onClick={() => removeTag(t)} aria-label={`Remove tag ${t}`} className="hover:text-destructive">
                            <X className="h-3 w-3" />
                          </button>
                        </Badge>
                      ))}
                    </div>
                  )}
                  <div className="text-[10px] text-muted-foreground">{tags.length}/6 tags</div>
                </div>
              </CardContent>
            </Card>

            {/* AI suggestions */}
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-sm flex items-center gap-2"><Bot className="h-4 w-4 text-primary" /> AI assistant (mock)</CardTitle>
                    <CardDescription className="text-xs mt-1">Deterministic suggestions — clearly labeled advisory. Never autonomous.</CardDescription>
                  </div>
                  <Button size="sm" variant="outline" onClick={handleAiSuggestions} disabled={generatingAi || (!title && !description)}>
                    {generatingAi ? <><Sparkles className="mr-1 h-3.5 w-3.5 animate-spin" /> Generating...</> : <><Sparkles className="mr-1 h-3.5 w-3.5" /> Suggest improvements</>}
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {aiSuggestions.length === 0 ? (
                  <div className="text-xs text-muted-foreground py-4 text-center">
                    Click <strong>Suggest improvements</strong> to generate mock AI suggestions.
                  </div>
                ) : (
                  <ul className="space-y-2">
                    {aiSuggestions.map((s) => (
                      <li key={s.id} className={cn("p-3 rounded-md border", s.accepted ? "border-accent/30 bg-accent/5" : "border-border bg-surface-2")}>
                        <div className="flex items-center justify-between mb-2">
                          <Badge variant="outline" className="text-[10px]">{s.field}</Badge>
                          <span className="text-[10px] text-muted-foreground">confidence {s.confidence}%</span>
                        </div>
                        <p className="text-xs mb-1 text-primary">{s.suggestedText}</p>
                        <p className="text-[11px] text-muted-foreground italic mb-2">↳ {s.rationale}</p>
                        {s.accepted ? (
                          <Button size="sm" variant="ghost" onClick={() => resetSuggestion(s)} className="h-6 text-[10px]">
                            <RotateCcw className="mr-1 h-3 w-3" /> Undo
                          </Button>
                        ) : (
                          <Button size="sm" variant="outline" onClick={() => applySuggestion(s)} className="h-6 text-[10px]">
                            <Check className="mr-1 h-3 w-3" /> Apply
                          </Button>
                        )}
                      </li>
                    ))}
                  </ul>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Actions sidebar */}
          <div className="space-y-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button className="w-full" onClick={() => submit("submit")} disabled={submitting !== null}>
                  <Send className="mr-2 h-4 w-4" /> {submitting === "submit" ? "Submitting..." : "Submit for review"}
                </Button>
                <Button variant="outline" className="w-full" onClick={() => submit("draft")} disabled={submitting !== null}>
                  <Save className="mr-2 h-4 w-4" /> {submitting === "draft" ? "Saving..." : "Save as draft"}
                </Button>
                <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
                  <DialogTrigger asChild>
                    <Button variant="ghost" className="w-full">
                      <Eye className="mr-2 h-4 w-4" /> Preview
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>Proposal preview</DialogTitle>
                      <DialogDescription>How your proposal will appear in the explorer.</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-3">
                      <div>
                        <Badge variant="outline">{CATEGORY_LABEL[category]}</Badge>
                      </div>
                      <h3 className="text-lg font-semibold">{title || "Untitled proposal"}</h3>
                      <p className="text-sm text-muted-foreground whitespace-pre-line">{description || "No description yet."}</p>
                      {tags.length > 0 && (
                        <div className="flex flex-wrap gap-1">{tags.map((t) => <Badge key={t} variant="secondary" className="text-[10px]">#{t}</Badge>)}</div>
                      )}
                      {location && <p className="text-xs text-muted-foreground">📍 {location}</p>}
                      {affectedCommunity && <p className="text-xs text-muted-foreground">👥 {affectedCommunity}</p>}
                      <p className="text-[10px] text-muted-foreground pt-2 border-t border-border">Author: {user.displayName} · Demo</p>
                    </div>
                  </DialogContent>
                </Dialog>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">Tips</CardTitle>
              </CardHeader>
              <CardContent className="text-xs text-muted-foreground space-y-2 leading-relaxed">
                <p>• Lead with the <strong className="text-foreground">problem</strong>, not the solution.</p>
                <p>• State <strong className="text-foreground">who is affected</strong> and quantify if possible.</p>
                <p>• Add a <strong className="text-foreground">measurable outcome</strong> (e.g., "reduce collisions by 30%").</p>
                <p>• Estimate <strong className="text-foreground">cost and timeline</strong> honestly.</p>
                <p>• Use 3-5 tags for discoverability.</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
