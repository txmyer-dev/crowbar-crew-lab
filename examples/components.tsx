/**
 * The Crowbar Crew — Component Examples
 *
 * Showcase of shadcn/ui components styled with the Crowbar Crew preset.
 * Drop these into a Next.js page to preview the design system.
 */

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

// ─── Button Variants ───────────────────────────────────────

export function ButtonShowcase() {
  return (
    <section className="space-y-6">
      <h2 className="text-2xl font-semibold text-primary-900">
        Buttons
      </h2>
      <div className="flex flex-wrap gap-3">
        <Button>Primary Action</Button>
        <Button variant="secondary">Secondary</Button>
        <Button variant="outline">Outline</Button>
        <Button variant="ghost">Ghost</Button>
        <Button variant="destructive">Destructive</Button>
        <Button variant="link">Link Style</Button>
      </div>

      <h3 className="text-lg font-medium text-primary-700">
        Sizes
      </h3>
      <div className="flex items-center gap-3">
        <Button size="sm">Small</Button>
        <Button size="default">Default</Button>
        <Button size="lg">Large</Button>
      </div>

      <h3 className="text-lg font-medium text-primary-700">
        Accent Button (Custom)
      </h3>
      <div className="flex gap-3">
        <Button className="bg-accent-500 text-primary-950 hover:bg-accent-600 active:bg-accent-700">
          Apply Leverage
        </Button>
        <Button className="bg-accent-500 text-primary-950 hover:bg-accent-600" size="lg">
          Get Started
        </Button>
      </div>
    </section>
  )
}

// ─── Card Variants ─────────────────────────────────────────

export function CardShowcase() {
  return (
    <section className="space-y-6">
      <h2 className="text-2xl font-semibold text-primary-900">
        Cards
      </h2>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Standard Card */}
        <Card>
          <CardHeader>
            <CardTitle>Agent Deployment</CardTitle>
            <CardDescription>Configure and deploy AI agents for your business</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Set up autonomous agents that handle customer support, data processing,
              and workflow automation — all running on your infrastructure.
            </p>
          </CardContent>
          <CardFooter>
            <Button className="w-full">Deploy Agent</Button>
          </CardFooter>
        </Card>

        {/* Accent Card */}
        <Card className="border-accent-500/30 bg-accent-50">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Company in a Box</CardTitle>
              <Badge className="bg-accent-500 text-primary-950">Popular</Badge>
            </div>
            <CardDescription>Full AI infrastructure, managed for you</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-primary-700">
              Everything you need to run an AI-powered business: agents, workflows,
              monitoring, and ongoing optimization.
            </p>
            <p className="mt-3 text-2xl font-bold text-primary-900">
              $650<span className="text-base font-normal text-primary-500">/week</span>
            </p>
          </CardContent>
          <CardFooter>
            <Button className="w-full bg-accent-500 text-primary-950 hover:bg-accent-600">
              Get Started
            </Button>
          </CardFooter>
        </Card>

        {/* Dark Card */}
        <Card className="border-primary-700 bg-primary-900 text-primary-50">
          <CardHeader>
            <CardTitle className="text-primary-50">Infrastructure Status</CardTitle>
            <CardDescription className="text-primary-400">All systems operational</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-primary-300">VPS (Hostinger)</span>
              <Badge variant="outline" className="border-success-500 text-success-500">Online</Badge>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-primary-300">Paperclip (EC2)</span>
              <Badge variant="outline" className="border-success-500 text-success-500">Online</Badge>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-primary-300">n8n Workflows</span>
              <Badge variant="outline" className="border-accent-500 text-accent-400">184 active</Badge>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  )
}

// ─── Typography ────────────────────────────────────────────

export function TypographyShowcase() {
  return (
    <section className="space-y-6">
      <h2 className="text-2xl font-semibold text-primary-900">
        Typography
      </h2>

      <div className="space-y-4">
        <h1 className="text-4xl font-bold text-primary-900">
          Applied Leverage
          <span className="text-accent-500">.</span>
        </h1>
        <h2 className="text-3xl font-semibold text-primary-900">
          Build Systems, Not Tasks
        </h2>
        <h3 className="text-2xl font-semibold text-primary-800">
          AI Infrastructure That Works While You Sleep
        </h3>
        <h4 className="text-xl font-medium text-primary-700">
          Section Heading
        </h4>
        <p className="text-base text-primary-600 leading-relaxed max-w-prose">
          The Crowbar Crew builds personal AI infrastructure for businesses that want
          to multiply their output without multiplying their headcount. We deploy agents,
          automate workflows, and build systems that compound.
        </p>
        <p className="text-sm text-primary-500">
          Secondary text — metadata, timestamps, supporting information.
        </p>
        <code className="font-mono text-sm bg-primary-100 text-primary-800 px-2 py-1 rounded">
          const agent = await deploy(config)
        </code>
      </div>

      <div className="space-y-2">
        <h3 className="text-lg font-medium text-primary-700">Font Families</h3>
        <p className="font-sans text-base">Inter — The workshop label maker (UI & body text)</p>
        <p className="font-mono text-base">JetBrains Mono — The precision instrument (code & data)</p>
      </div>
    </section>
  )
}

// ─── Form Elements ─────────────────────────────────────────

export function FormShowcase() {
  return (
    <section className="space-y-6">
      <h2 className="text-2xl font-semibold text-primary-900">
        Form Elements
      </h2>
      <div className="max-w-sm space-y-4">
        <div className="space-y-2">
          <Label htmlFor="company">Company Name</Label>
          <Input id="company" placeholder="Acme Corp" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="agents">Number of Agents</Label>
          <Input id="agents" type="number" placeholder="4" />
        </div>
        <Button className="w-full bg-accent-500 text-primary-950 hover:bg-accent-600">
          Request Deployment
        </Button>
      </div>
    </section>
  )
}

// ─── Badges ────────────────────────────────────────────────

export function BadgeShowcase() {
  return (
    <section className="space-y-6">
      <h2 className="text-2xl font-semibold text-primary-900">
        Badges
      </h2>
      <div className="flex flex-wrap gap-2">
        <Badge>Default</Badge>
        <Badge variant="secondary">Secondary</Badge>
        <Badge variant="outline">Outline</Badge>
        <Badge variant="destructive">Destructive</Badge>
        <Badge className="bg-accent-500 text-primary-950">Accent</Badge>
        <Badge className="bg-success-100 text-success-700 border-success-500/30">Online</Badge>
        <Badge className="bg-warning-100 text-warning-700 border-warning-500/30">Pending</Badge>
        <Badge className="bg-info-100 text-info-700 border-info-500/30">Info</Badge>
      </div>
    </section>
  )
}

// ─── Full Page Preview ─────────────────────────────────────

export default function StylebookPreview() {
  return (
    <div className="min-h-screen bg-background p-8 space-y-12">
      <header className="space-y-2">
        <h1 className="text-4xl font-bold text-primary-900">
          The Crowbar Crew
          <span className="text-accent-500">.</span>
        </h1>
        <p className="text-lg text-primary-500 font-mono">Applied Leverage</p>
      </header>

      <TypographyShowcase />
      <ButtonShowcase />
      <CardShowcase />
      <BadgeShowcase />
      <FormShowcase />
    </div>
  )
}
