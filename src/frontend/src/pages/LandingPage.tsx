import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ArrowRight,
  Bike,
  CheckCircle2,
  ChevronRight,
  Clock,
  DollarSign,
  Facebook,
  Instagram,
  Loader2,
  Menu,
  Smartphone,
  Star,
  Twitter,
  X,
  Zap,
} from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import type { Page } from "../App";
import { DriverStatus, VehicleType } from "../backend";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import { useSaveDriverProfile } from "../hooks/useQueries";

interface Props {
  navigate: (page: Page) => void;
}

const features = [
  {
    icon: Clock,
    title: "Flexible Hours",
    desc: "Ride whenever you want. Set your own schedule and work around your life, not the other way around.",
  },
  {
    icon: DollarSign,
    title: "Great Earnings",
    desc: "Competitive rates plus bonuses. Earn up to $25/hour during peak periods in your city.",
  },
  {
    icon: Smartphone,
    title: "Easy App",
    desc: "Our driver app is intuitive and simple. Accept rides, navigate, and track earnings all in one place.",
  },
  {
    icon: Zap,
    title: "Fast Payouts",
    desc: "Get paid weekly or request instant payouts. Your money, your timeline.",
  },
];

const steps = [
  {
    icon: CheckCircle2,
    label: "Sign Up",
    desc: "Create your account in minutes with your basic info.",
  },
  {
    icon: CheckCircle2,
    label: "Get Approved",
    desc: "We review your application within 24–48 hours.",
  },
  {
    icon: CheckCircle2,
    label: "Start Riding",
    desc: "Accept your first ride request and start earning.",
  },
  {
    icon: CheckCircle2,
    label: "Get Paid",
    desc: "Weekly payouts direct to your bank account.",
  },
];

const testimonials = [
  {
    name: "James Okafor",
    location: "Lagos, Nigeria",
    quote:
      "CycleRide completely changed my income game. I make more in 4 hours of cycling than I used to in a whole day at my old job. Flexible, easy, and the app works flawlessly.",
    rating: 5,
    avatar: "/assets/generated/driver-james.dim_80x80.jpg",
  },
  {
    name: "Sarah Chen",
    location: "Nairobi, Kenya",
    quote:
      "I was skeptical at first but the earnings are real. I set my own hours around school and it's perfect. The instant payout feature is a game changer!",
    rating: 5,
    avatar: "/assets/generated/driver-sarah.dim_80x80.jpg",
  },
  {
    name: "Carlos Mendez",
    location: "Accra, Ghana",
    quote:
      "Three months in and I've already paid off my e-bike. The team is supportive, the platform is transparent about earnings. 100% recommend to anyone looking for flexible income.",
    rating: 5,
    avatar: "/assets/generated/driver-carlos.dim_80x80.jpg",
  },
];

export default function LandingPage({ navigate }: Props) {
  const { login, loginStatus, identity } = useInternetIdentity();
  const { mutateAsync: saveProfile, isPending } = useSaveDriverProfile();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeTestimonial, setActiveTestimonial] = useState(0);

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    city: "",
    vehicleType: "" as VehicleType | "",
    licenseNumber: "",
  });

  const handleFormChange = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!identity) {
      toast.error("Please log in first to register as a driver.");
      return;
    }
    if (!form.vehicleType) {
      toast.error("Please select a vehicle type.");
      return;
    }
    try {
      await saveProfile({
        name: form.name,
        email: form.email,
        phone: form.phone,
        city: form.city,
        vehicleType: form.vehicleType as VehicleType,
        licenseNumber: form.licenseNumber,
        status: DriverStatus.pending,
      });
      toast.success(
        "Application submitted! We'll review it within 24–48 hours.",
      );
      navigate("driver-dashboard");
    } catch {
      toast.error("Something went wrong. Please try again.");
    }
  };

  const handleLogin = async () => {
    await login();
  };

  const navLinks = [
    { href: "#features", label: "Features" },
    { href: "#how-it-works", label: "How it Works" },
    { href: "#earnings", label: "Earnings" },
    { href: "#testimonials", label: "Stories" },
    {
      href: "https://cycleride-vs0.caffeine.xyz",
      label: "Go to CycleRide",
      external: true,
    },
  ];

  const isLoggingIn = loginStatus === "logging-in";

  return (
    <div className="min-h-screen flex flex-col">
      {/* Navbar */}
      <header
        className="sticky top-0 z-50 bg-card shadow-navbar"
        data-ocid="nav.panel"
      >
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          {/* Logo */}
          <a
            href="#!"
            className="flex items-center gap-2 font-bold text-xl text-foreground"
          >
            <Bike className="w-7 h-7 text-primary" />
            <span>CycleUser</span>
          </a>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-6">
            {navLinks.map((link) =>
              link.external ? (
                <a
                  key={link.label}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
                  data-ocid="nav.link"
                >
                  {link.label}
                </a>
              ) : (
                <a
                  key={link.label}
                  href={link.href}
                  className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
                  data-ocid="nav.link"
                >
                  {link.label}
                </a>
              ),
            )}
          </nav>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center gap-3">
            {identity ? (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigate("driver-dashboard")}
                  data-ocid="nav.link"
                >
                  Dashboard
                </Button>
                <Button
                  size="sm"
                  onClick={() => navigate("admin-dashboard")}
                  data-ocid="nav.link"
                >
                  Admin
                </Button>
              </>
            ) : (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleLogin}
                  disabled={isLoggingIn}
                  data-ocid="nav.link"
                >
                  {isLoggingIn ? (
                    <Loader2 className="w-4 h-4 animate-spin mr-1" />
                  ) : null}
                  Log In
                </Button>
                <Button
                  size="sm"
                  onClick={handleLogin}
                  disabled={isLoggingIn}
                  data-ocid="nav.primary_button"
                >
                  Sign Up
                </Button>
              </>
            )}
          </div>

          {/* Mobile toggle */}
          <button
            type="button"
            className="md:hidden p-2 rounded-md hover:bg-muted"
            onClick={() => setMobileOpen(!mobileOpen)}
            data-ocid="nav.toggle"
          >
            {mobileOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </button>
        </div>

        {/* Mobile Nav */}
        {mobileOpen && (
          <div className="md:hidden bg-card border-t border-border px-4 py-4 flex flex-col gap-3">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-sm font-medium text-muted-foreground hover:text-primary py-1"
                onClick={() => setMobileOpen(false)}
                {...(link.external
                  ? { target: "_blank", rel: "noopener noreferrer" }
                  : {})}
              >
                {link.label}
              </a>
            ))}
            <div className="flex gap-2 pt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleLogin}
                disabled={isLoggingIn}
                className="flex-1"
              >
                Log In
              </Button>
              <Button
                size="sm"
                onClick={handleLogin}
                disabled={isLoggingIn}
                className="flex-1"
              >
                Sign Up
              </Button>
            </div>
          </div>
        )}
      </header>

      {/* Hero Section */}
      <section
        className="relative min-h-[85vh] flex items-center"
        style={{
          backgroundImage: `url('/assets/generated/hero-cyclists.dim_1400x700.jpg')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        {/* Overlay */}
        <div className="absolute inset-0 bg-navy/75" />

        <div className="relative z-10 container mx-auto px-4 py-16">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left: Headline */}
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7 }}
              className="text-white"
            >
              <span className="inline-block bg-primary/20 border border-primary/40 text-green-300 text-sm font-semibold px-4 py-1.5 rounded-full mb-6">
                🚴 Join 50,000+ Active Drivers
              </span>
              <h1 className="text-5xl lg:text-6xl font-extrabold leading-tight mb-6">
                Earn Money,
                <br />
                <span className="text-green-400">Ride Free</span>
              </h1>
              <p className="text-lg text-white/80 mb-8 max-w-md">
                Turn your bicycle or e-bike into a steady income stream.
                Flexible hours, great pay, and a platform that puts drivers
                first.
              </p>
              <div className="flex flex-wrap gap-4">
                <a href="#register">
                  <Button
                    size="lg"
                    className="bg-primary hover:bg-primary/90 text-white font-semibold gap-2"
                    data-ocid="hero.primary_button"
                  >
                    Start Earning Today <ArrowRight className="w-4 h-4" />
                  </Button>
                </a>
                <a href="#how-it-works">
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-white/40 text-white hover:bg-white/10 hover:text-white"
                    data-ocid="hero.secondary_button"
                  >
                    How it Works
                  </Button>
                </a>
              </div>

              <div className="mt-10 flex gap-8">
                {[
                  { value: "$25/hr", label: "Avg Peak Earnings" },
                  { value: "48h", label: "Fast Approval" },
                  { value: "4.9★", label: "Driver Rating" },
                ].map((stat) => (
                  <div key={stat.label}>
                    <div className="text-2xl font-bold text-green-400">
                      {stat.value}
                    </div>
                    <div className="text-sm text-white/60">{stat.label}</div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Right: Registration Card */}
            <motion.div
              id="register"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
            >
              <div className="bg-card rounded-2xl shadow-2xl p-8">
                <h2 className="text-xl font-bold text-foreground mb-1">
                  Become a CycleRide Driver
                </h2>
                <p className="text-muted-foreground text-sm mb-6">
                  Fill in your details to get started
                </p>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name">Full Name</Label>
                      <Input
                        id="name"
                        placeholder="John Doe"
                        value={form.name}
                        onChange={(e) =>
                          handleFormChange("name", e.target.value)
                        }
                        required
                        className="mt-1"
                        data-ocid="register.input"
                      />
                    </div>
                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="you@email.com"
                        value={form.email}
                        onChange={(e) =>
                          handleFormChange("email", e.target.value)
                        }
                        required
                        className="mt-1"
                        data-ocid="register.input"
                      />
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="phone">Phone</Label>
                      <Input
                        id="phone"
                        placeholder="+1 555 0100"
                        value={form.phone}
                        onChange={(e) =>
                          handleFormChange("phone", e.target.value)
                        }
                        required
                        className="mt-1"
                        data-ocid="register.input"
                      />
                    </div>
                    <div>
                      <Label htmlFor="city">City</Label>
                      <Input
                        id="city"
                        placeholder="Lagos"
                        value={form.city}
                        onChange={(e) =>
                          handleFormChange("city", e.target.value)
                        }
                        required
                        className="mt-1"
                        data-ocid="register.input"
                      />
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="vehicle">Vehicle Type</Label>
                      <Select
                        value={form.vehicleType}
                        onValueChange={(v) =>
                          handleFormChange("vehicleType", v)
                        }
                      >
                        <SelectTrigger
                          id="vehicle"
                          className="mt-1"
                          data-ocid="register.select"
                        >
                          <SelectValue placeholder="Select vehicle" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value={VehicleType.bicycle}>
                            Bicycle
                          </SelectItem>
                          <SelectItem value={VehicleType.scooter}>
                            Scooter / E-Bike
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="license">License / ID No.</Label>
                      <Input
                        id="license"
                        placeholder="DL-123456"
                        value={form.licenseNumber}
                        onChange={(e) =>
                          handleFormChange("licenseNumber", e.target.value)
                        }
                        required
                        className="mt-1"
                        data-ocid="register.input"
                      />
                    </div>
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-primary hover:bg-primary/90 text-white font-semibold"
                    disabled={isPending}
                    data-ocid="register.submit_button"
                  >
                    {isPending ? (
                      <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    ) : null}
                    {isPending ? "Submitting..." : "Create Driver Account"}
                  </Button>

                  <p className="text-xs text-center text-muted-foreground">
                    By signing up you agree to our{" "}
                    <a href="#!" className="underline hover:text-primary">
                      Terms of Service
                    </a>{" "}
                    and{" "}
                    <a href="#!" className="underline hover:text-primary">
                      Privacy Policy
                    </a>
                    .
                  </p>
                </form>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-14"
          >
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
              Why Drive with Us?
            </h2>
            <p className="text-muted-foreground max-w-lg mx-auto">
              We built CycleRide to put drivers first. Here's why thousands
              choose us every day.
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feat, i) => (
              <motion.div
                key={feat.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="bg-card rounded-xl p-6 shadow-card border border-border hover:border-primary/40 transition-colors"
                data-ocid={`features.item.${i + 1}`}
              >
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4">
                  <feat.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-bold text-foreground mb-2">{feat.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {feat.desc}
                </p>
              </motion.div>
            ))}
          </div>

          {/* Promo strip */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-10 bg-primary/5 border border-primary/20 rounded-2xl p-8 flex flex-col md:flex-row items-center justify-between gap-6"
          >
            <div>
              <h3 className="text-xl font-bold text-foreground mb-3">
                Exclusive Driver Benefits
              </h3>
              <ul className="space-y-2">
                {[
                  "Free accident insurance coverage",
                  "24/7 driver support hotline",
                  "Performance-based bonuses every week",
                  "Discounts on bike maintenance & repairs",
                ].map((b) => (
                  <li
                    key={b}
                    className="flex items-center gap-2 text-sm text-muted-foreground"
                  >
                    <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />
                    {b}
                  </li>
                ))}
              </ul>
            </div>
            <a href="#register">
              <Button
                className="bg-primary hover:bg-primary/90 text-white"
                data-ocid="features.primary_button"
              >
                Learn More <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </a>
          </motion.div>
        </div>
      </section>

      {/* How it Works */}
      <section id="how-it-works" className="py-20 bg-muted/40">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-14"
          >
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
              How it Works
            </h2>
            <p className="text-muted-foreground max-w-lg mx-auto">
              Get on the road in four simple steps. From signup to first payout
              in under a week.
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 relative">
            {steps.map((step, i) => (
              <motion.div
                key={step.label}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.12 }}
                className="relative flex flex-col items-center text-center"
                data-ocid={`steps.item.${i + 1}`}
              >
                {/* Step circle */}
                <div className="w-16 h-16 rounded-full bg-primary text-white flex items-center justify-center text-2xl font-extrabold mb-4 shadow-lg">
                  {i + 1}
                </div>
                {/* Arrow separator (not on last) */}
                {i < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-8 left-[calc(50%+2.5rem)] w-[calc(100%-5rem)] h-0.5 bg-primary/25" />
                )}
                <h3 className="font-bold text-foreground mb-2">{step.label}</h3>
                <p className="text-sm text-muted-foreground">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-14"
          >
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
              Driver Success Stories
            </h2>
            <p className="text-muted-foreground max-w-lg mx-auto">
              Real stories from drivers who transformed their lives with
              CycleRide.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <motion.div
                key={t.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className={`bg-card rounded-xl p-6 shadow-card border transition-all cursor-pointer ${
                  activeTestimonial === i ? "border-primary" : "border-border"
                }`}
                onClick={() => setActiveTestimonial(i)}
                data-ocid={`testimonials.item.${i + 1}`}
              >
                <div className="flex items-center gap-3 mb-4">
                  <img
                    src={t.avatar}
                    alt={t.name}
                    className="w-12 h-12 rounded-full object-cover border-2 border-primary/30"
                  />
                  <div>
                    <div className="font-bold text-sm text-foreground">
                      {t.name}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {t.location}
                    </div>
                  </div>
                </div>
                <div className="flex gap-0.5 mb-3">
                  {[1, 2, 3, 4, 5].slice(0, t.rating).map((n) => (
                    <Star
                      key={n}
                      className="w-4 h-4 fill-yellow-400 text-yellow-400"
                    />
                  ))}
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed italic">
                  "{t.quote}"
                </p>
              </motion.div>
            ))}
          </div>

          {/* Dots */}
          <div className="flex justify-center gap-2 mt-8">
            {testimonials.map((t, i) => (
              <button
                type="button"
                key={t.name}
                className={`w-2.5 h-2.5 rounded-full transition-colors ${
                  activeTestimonial === i
                    ? "bg-primary"
                    : "bg-muted-foreground/30"
                }`}
                onClick={() => setActiveTestimonial(i)}
                data-ocid="testimonials.toggle"
              />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section id="earnings" className="py-20 bg-primary">
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="container mx-auto px-4 text-center"
        >
          <h2 className="text-3xl lg:text-4xl font-extrabold text-white mb-4">
            Ready to Roll?
          </h2>
          <p className="text-white/80 mb-8 max-w-md mx-auto">
            Join thousands of drivers already earning on CycleRide. Sign up
            takes less than 5 minutes.
          </p>
          <a href="#register">
            <Button
              size="lg"
              className="bg-white text-primary hover:bg-white/90 font-bold gap-2"
              data-ocid="cta.primary_button"
            >
              Get Started Now <ArrowRight className="w-4 h-4" />
            </Button>
          </a>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="bg-navy text-white pt-16 pb-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
            {/* Brand */}
            <div className="md:col-span-1">
              <div className="flex items-center gap-2 font-bold text-xl mb-4">
                <Bike className="w-7 h-7 text-green-400" />
                <span>CycleUser</span>
              </div>
              <p className="text-white/60 text-sm leading-relaxed">
                The premier driver portal for CycleRide. Empowering cyclists to
                earn more.
              </p>
            </div>

            {/* Resources */}
            <div>
              <h4 className="font-semibold text-white mb-4">Resources</h4>
              <ul className="space-y-3">
                {[
                  "Driver Guide",
                  "Earnings Calculator",
                  "Safety Tips",
                  "Help Center",
                ].map((l) => (
                  <li key={l}>
                    <a
                      href="#!"
                      className="text-white/60 text-sm hover:text-green-400 transition-colors"
                    >
                      {l}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Portal */}
            <div>
              <h4 className="font-semibold text-white mb-4">Portal</h4>
              <ul className="space-y-3">
                {[
                  {
                    label: "Driver Dashboard",
                    action: () => navigate("driver-dashboard"),
                  },
                  {
                    label: "Admin Dashboard",
                    action: () => navigate("admin-dashboard"),
                  },
                  {
                    label: "Go to CycleRide",
                    href: "https://cycleride-vs0.caffeine.xyz",
                  },
                ].map((l) => (
                  <li key={l.label}>
                    {l.href ? (
                      <a
                        href={l.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-white/60 text-sm hover:text-green-400 transition-colors"
                        data-ocid="footer.link"
                      >
                        {l.label}
                      </a>
                    ) : (
                      <button
                        type="button"
                        onClick={l.action}
                        className="text-white/60 text-sm hover:text-green-400 transition-colors"
                        data-ocid="footer.link"
                      >
                        {l.label}
                      </button>
                    )}
                  </li>
                ))}
              </ul>
            </div>

            {/* Legal */}
            <div>
              <h4 className="font-semibold text-white mb-4">Legal</h4>
              <ul className="space-y-3">
                {["Privacy Policy", "Terms of Service", "Cookie Policy"].map(
                  (l) => (
                    <li key={l}>
                      <a
                        href="#!"
                        className="text-white/60 text-sm hover:text-green-400 transition-colors"
                      >
                        {l}
                      </a>
                    </li>
                  ),
                )}
              </ul>
              {/* Social Icons */}
              <div className="flex gap-3 mt-6">
                <a
                  href="#!"
                  className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-primary transition-colors"
                  data-ocid="footer.link"
                >
                  <Facebook className="w-4 h-4" />
                </a>
                <a
                  href="#!"
                  className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-primary transition-colors"
                  data-ocid="footer.link"
                >
                  <Twitter className="w-4 h-4" />
                </a>
                <a
                  href="#!"
                  className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-primary transition-colors"
                  data-ocid="footer.link"
                >
                  <Instagram className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>

          <div className="border-t border-white/10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-2 text-sm text-white/40">
            <span>
              © {new Date().getFullYear()} CycleUser. All rights reserved.
            </span>
            <span>
              Built with ❤️ using{" "}
              <a
                href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:text-white/70"
              >
                caffeine.ai
              </a>
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
